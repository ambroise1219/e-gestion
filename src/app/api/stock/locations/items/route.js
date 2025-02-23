import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock/locations/items - Récupérer les affectations articles-emplacements
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const itemId = searchParams.get('itemId');
    const locationId = searchParams.get('locationId');

    let sqlQuery = `
      SELECT 
        il.*,
        i.name as item_name,
        i.reference as item_reference,
        i.unit as item_unit,
        l.name as location_name,
        l.type as location_type
      FROM inventory_item_locations il
      JOIN inventory_items i ON il.item_id = i.id
      JOIN inventory_locations l ON il.location_id = l.id
      WHERE 1=1
    `;

    const queryParams = [];
    
    if (itemId) {
      sqlQuery += ` AND il.item_id = $${queryParams.length + 1}`;
      queryParams.push(itemId);
    }

    if (locationId) {
      sqlQuery += ` AND il.location_id = $${queryParams.length + 1}`;
      queryParams.push(locationId);
    }

    sqlQuery += ' ORDER BY l.name ASC';

    const result = await query(sqlQuery, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching item locations:', error);
    return NextResponse.json(
      { error: 'Error fetching item locations' },
      { status: 500 }
    );
  }
}

// POST /api/stock/locations/items - Affecter un article à un emplacement
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      item_id,
      location_id,
      quantity,
      is_primary = false
    } = data;

    // Vérifier les données requises
    if (!item_id || !location_id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Commencer une transaction
    await query('BEGIN');

    try {
      // Vérifier la capacité de l'emplacement
      const locationCheck = await query(
        `SELECT 
          l.capacity,
          COALESCE(SUM(il.quantity), 0) as current_occupancy
        FROM inventory_locations l
        LEFT JOIN inventory_item_locations il ON l.id = il.location_id
        WHERE l.id = $1
        GROUP BY l.id, l.capacity`,
        [location_id]
      );

      if (locationCheck.rows[0].capacity > 0) {
        const newOccupancy = locationCheck.rows[0].current_occupancy + quantity;
        if (newOccupancy > locationCheck.rows[0].capacity) {
          throw new Error('Location capacity exceeded');
        }
      }

      // Vérifier la quantité totale disponible
      const itemCheck = await query(
        'SELECT quantity FROM inventory_items WHERE id = $1',
        [item_id]
      );

      if (itemCheck.rows[0].quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Si c'est l'emplacement principal, mettre à jour les autres
      if (is_primary) {
        await query(
          'UPDATE inventory_item_locations SET is_primary = false WHERE item_id = $1',
          [item_id]
        );
      }

      // Insérer ou mettre à jour l'affectation
      const result = await query(
        `INSERT INTO inventory_item_locations (
          item_id,
          location_id,
          quantity,
          is_primary
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (item_id, location_id) 
        DO UPDATE SET 
          quantity = EXCLUDED.quantity,
          is_primary = EXCLUDED.is_primary
        RETURNING *`,
        [item_id, location_id, quantity, is_primary]
      );

      await query('COMMIT');

      // Récupérer les détails complets
      const completeResult = await query(
        `SELECT 
          il.*,
          i.name as item_name,
          i.reference as item_reference,
          i.unit as item_unit,
          l.name as location_name,
          l.type as location_type
        FROM inventory_item_locations il
        JOIN inventory_items i ON il.item_id = i.id
        JOIN inventory_locations l ON il.location_id = l.id
        WHERE il.item_id = $1 AND il.location_id = $2`,
        [item_id, location_id]
      );

      return NextResponse.json(completeResult.rows[0]);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error assigning item location:', error);
    return NextResponse.json(
      { error: error.message || 'Error assigning item location' },
      { status: 500 }
    );
  }
}

// PUT /api/stock/locations/items - Modifier l'affectation d'un article
export async function PUT(request) {
  try {
    const data = await request.json();
    const {
      item_id,
      location_id,
      quantity,
      is_primary
    } = data;

    if (!item_id || !location_id) {
      return NextResponse.json(
        { error: 'Item ID and Location ID are required' },
        { status: 400 }
      );
    }

    // Commencer une transaction
    await query('BEGIN');

    try {
      // Si c'est l'emplacement principal, mettre à jour les autres
      if (is_primary) {
        await query(
          'UPDATE inventory_item_locations SET is_primary = false WHERE item_id = $1',
          [item_id]
        );
      }

      const result = await query(
        `UPDATE inventory_item_locations
         SET quantity = $3,
             is_primary = $4
         WHERE item_id = $1 AND location_id = $2
         RETURNING *`,
        [item_id, location_id, quantity, is_primary]
      );

      if (result.rows.length === 0) {
        throw new Error('Assignment not found');
      }

      await query('COMMIT');

      // Récupérer les détails complets
      const completeResult = await query(
        `SELECT 
          il.*,
          i.name as item_name,
          i.reference as item_reference,
          i.unit as item_unit,
          l.name as location_name,
          l.type as location_type
        FROM inventory_item_locations il
        JOIN inventory_items i ON il.item_id = i.id
        JOIN inventory_locations l ON il.location_id = l.id
        WHERE il.item_id = $1 AND il.location_id = $2`,
        [item_id, location_id]
      );

      return NextResponse.json(completeResult.rows[0]);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating item location:', error);
    return NextResponse.json(
      { error: error.message || 'Error updating item location' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock/locations/items - Supprimer l'affectation d'un article
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');
    const locationId = searchParams.get('locationId');

    if (!itemId || !locationId) {
      return NextResponse.json(
        { error: 'Item ID and Location ID are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'DELETE FROM inventory_item_locations WHERE item_id = $1 AND location_id = $2 RETURNING *',
      [itemId, locationId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Assignment removed successfully',
      item_id: itemId,
      location_id: locationId
    });
  } catch (error) {
    console.error('Error removing item location:', error);
    return NextResponse.json(
      { error: 'Error removing item location' },
      { status: 500 }
    );
  }
}