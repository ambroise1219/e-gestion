import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock/suppliers - Récupérer tous les fournisseurs
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    let sqlQuery = `
      SELECT 
        s.*,
        COUNT(DISTINCT i.id) as items_count,
        COALESCE(SUM(i.quantity * i.unit_price), 0) as total_value
      FROM suppliers s
      LEFT JOIN inventory_items i ON s.id = i.supplier_id
      WHERE s.status = 'active'
    `;

    const queryParams = [];
    
    if (id) {
      sqlQuery += ` AND s.id = $1`;
      queryParams.push(id);
    }

    sqlQuery += ` GROUP BY s.id ORDER BY s.name ASC`;

    const result = await query(sqlQuery, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Error fetching suppliers' },
      { status: 500 }
    );
  }
}

// POST /api/stock/suppliers - Ajouter un nouveau fournisseur
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      name,
      contact_person,
      email,
      phone,
      address,
      tax_id,
      notes,
      payment_terms,
      status = 'active'
    } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO suppliers (
        name,
        contact_person,
        email,
        phone,
        address,
        tax_id,
        notes,
        payment_terms,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        name,
        contact_person,
        email,
        phone,
        address,
        tax_id,
        notes,
        payment_terms,
        status
      ]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Error creating supplier' },
      { status: 500 }
    );
  }
}

// PUT /api/stock/suppliers - Mettre à jour un fournisseur
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(updateData);

    const result = await query(
      `UPDATE suppliers
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, ...values]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Supplier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json(
      { error: 'Error updating supplier' },
      { status: 500 }
    );
  }
}

// DELETE /api/stock/suppliers - Désactiver un fournisseur
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    // Vérifier si le fournisseur a des articles associés
    const hasItems = await query(
      'SELECT COUNT(*) as count FROM inventory_items WHERE supplier_id = $1',
      [id]
    );

    if (hasItems.rows[0].count > 0) {
      // Désactiver le fournisseur au lieu de le supprimer
      const result = await query(
        `UPDATE suppliers 
         SET status = 'inactive', 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Supplier not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Supplier deactivated successfully',
        supplier: result.rows[0]
      });
    } else {
      // Supprimer le fournisseur s'il n'a pas d'articles
      const result = await query(
        'DELETE FROM suppliers WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'Supplier not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Supplier deleted successfully',
        id: result.rows[0].id
      });
    }
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json(
      { error: 'Error deleting supplier' },
      { status: 500 }
    );
  }
}