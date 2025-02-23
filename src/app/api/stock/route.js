import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock - Récupérer tous les éléments du stock
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const supplier = searchParams.get('supplier');
    const id = searchParams.get('id');

    let sqlQuery = `
      WITH recent_transactions AS (
        SELECT 
          item_id,
          json_agg(
            json_build_object(
              'id', id,
              'type', transaction_type,
              'quantity', quantity,
              'reference', reference,
              'date', created_at,
              'notes', notes
            )
          ) as transactions
        FROM (
          SELECT *,
            ROW_NUMBER() OVER (PARTITION BY item_id ORDER BY created_at DESC) as rn
          FROM inventory_transactions
        ) t
        WHERE rn <= 5
        GROUP BY item_id
      )
      SELECT 
        i.*,
        s.name as supplier_name,
        s.contact_person as supplier_contact,
        s.email as supplier_email,
        s.phone as supplier_phone,
        COALESCE(rt.transactions, '[]'::json) as recent_transactions
      FROM inventory_items i
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      LEFT JOIN recent_transactions rt ON i.id = rt.item_id
      WHERE i.status != 'archived'
    `;

    const queryParams = [];
    
    if (id) {
      sqlQuery += ` AND i.id = $${queryParams.length + 1}`;
      queryParams.push(id);
    }

    if (category && category !== 'all') {
      sqlQuery += ` AND i.category = $${queryParams.length + 1}`;
      queryParams.push(category);
    }

    if (status && status !== 'all') {
      sqlQuery += ` AND i.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }

    if (supplier && supplier !== 'all') {
      sqlQuery += ` AND i.supplier_id = $${queryParams.length + 1}`;
      queryParams.push(supplier);
    }

    sqlQuery += ' ORDER BY i.name ASC';

    const result = await query(sqlQuery, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Error fetching inventory' },
      { status: 500 }
    );
  }
}

// POST /api/stock - Ajouter un nouvel élément au stock
export async function POST(request) {
  let client;
  try {
    const data = await request.json();
    const {
      name,
      reference,
      description,
      quantity,
      unit,
      min_quantity,
      max_quantity,
      category,
      status = 'active',
      unit_price,
      supplier_id
    } = data;

    // Vérifier les données requises
    if (!name || !reference || !unit || quantity == null || min_quantity == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Obtenir une connexion du pool
    client = await query('BEGIN');

    try {
      // Insérer l'article
      const result = await query(
        `INSERT INTO inventory_items (
          name,
          reference,
          description,
          quantity,
          unit,
          min_quantity,
          max_quantity,
          category,
          status,
          unit_price,
          supplier_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          name,
          reference,
          description,
          quantity,
          unit,
          min_quantity,
          max_quantity || null,
          category,
          status,
          unit_price || null,
          supplier_id || null // Convertit une chaîne vide en null
        ]
      );

      // Créer une transaction initiale si la quantité est positive
      if (result.rows[0] && quantity > 0) {
        await query(
          `INSERT INTO inventory_transactions (
            item_id,
            reference,
            transaction_type,
            quantity,
            notes
          ) VALUES ($1, $2, $3, $4, $5)`,
          [
            result.rows[0].id,
            `INIT-${result.rows[0].reference}`,
            'initial',
            quantity,
            'Stock initial'
          ]
        );
      }

      await query('COMMIT');
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      if (client) {
        await query('ROLLBACK');
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: 'Error creating inventory item' },
      { status: 500 }
    );
  }
}

// PUT /api/stock - Mettre à jour un élément du stock
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(updateData);

    const result = await query(
      `UPDATE inventory_items
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { error: 'Error updating inventory item' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock - Archiver un élément du stock
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE inventory_items 
       SET status = 'archived', 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Item archived successfully',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error archiving inventory item:', error);
    return NextResponse.json(
      { error: 'Error archiving inventory item' },
      { status: 500 }
    );
  }
}