import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock/locations - Récupérer tous les emplacements
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    const itemId = searchParams.get('itemId');

    let sqlQuery = `
      WITH location_occupancy AS (
        SELECT 
          location_id,
          SUM(quantity) as total_quantity,
          COUNT(DISTINCT item_id) as unique_items
        FROM inventory_item_locations
        GROUP BY location_id
      )
      SELECT 
        l.*,
        COALESCE(o.total_quantity, 0) as total_items,
        COALESCE(o.unique_items, 0) as unique_items,
        CASE 
          WHEN l.capacity > 0 THEN 
            ROUND((COALESCE(o.total_quantity, 0)::numeric / NULLIF(l.capacity, 0)::numeric) * 100)
          ELSE 0
        END as occupancy_rate
      FROM inventory_locations l
      LEFT JOIN location_occupancy o ON l.id = o.location_id
      WHERE l.status = 'active'
    `;

    const queryParams = [];
    
    if (id) {
      sqlQuery += ` AND l.id = $${queryParams.length + 1}`;
      queryParams.push(id);
    }

    if (itemId) {
      sqlQuery = `
        WITH item_locations AS (
          SELECT 
            l.*,
            il.quantity as item_quantity,
            il.is_primary
          FROM inventory_locations l
          LEFT JOIN inventory_item_locations il ON l.id = il.location_id
          WHERE il.item_id = $1 AND l.status = 'active'
        )
        SELECT * FROM item_locations
      `;
      queryParams.push(itemId);
    }

    sqlQuery += ' ORDER BY l.name ASC';

    const result = await query(sqlQuery, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Error fetching locations' },
      { status: 500 }
    );
  }
}

// POST /api/stock/locations - Créer un nouvel emplacement
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      type,
      capacity,
      status = 'active'
    } = data;

    // Vérifier les données requises
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO inventory_locations (
        name,
        type,
        capacity,
        status
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [name, type, capacity, status]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Error creating location' },
      { status: 500 }
    );
  }
}

// PUT /api/stock/locations - Mettre à jour un emplacement
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(updateData);

    const result = await query(
      `UPDATE inventory_locations
       SET ${setClause}
       WHERE id = $1
       RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Error updating location' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock/locations - Désactiver un emplacement
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    // Vérifier si l'emplacement contient des articles
    const hasItems = await query(
      'SELECT COUNT(*) as count FROM inventory_item_locations WHERE location_id = $1',
      [id]
    );

    if (hasItems.rows[0].count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete location with items' },
        { status: 400 }
      );
    }

    // Désactiver l'emplacement au lieu de le supprimer
    const result = await query(
      `UPDATE inventory_locations 
       SET status = 'inactive'
       WHERE id = $1 
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Location deactivated successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error deactivating location:', error);
    return NextResponse.json(
      { error: 'Error deactivating location' },
      { status: 500 }
    );
  }
}