import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock/transactions - Récupérer les transactions
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const itemId = searchParams.get('itemId');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let sqlQuery = `
      SELECT 
        t.*,
        src.name as source_location_name,
        dst.name as destination_location_name,
        u.firstname || ' ' || u.lastname as user_name
      FROM inventory_transactions t
      LEFT JOIN inventory_locations src ON t.source_location_id = src.id
      LEFT JOIN inventory_locations dst ON t.destination_location_id = dst.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;

    const queryParams = [];
    
    if (itemId) {
      sqlQuery += ` AND t.item_id = $${queryParams.length + 1}`;
      queryParams.push(itemId);
    }

    if (type) {
      sqlQuery += ` AND t.transaction_type = $${queryParams.length + 1}`;
      queryParams.push(type);
    }

    if (startDate) {
      sqlQuery += ` AND t.created_at >= $${queryParams.length + 1}`;
      queryParams.push(startDate);
    }

    if (endDate) {
      sqlQuery += ` AND t.created_at <= $${queryParams.length + 1}`;
      queryParams.push(endDate);
    }

    sqlQuery += ' ORDER BY t.created_at DESC';

    const result = await query(sqlQuery, queryParams);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Error fetching transactions' },
      { status: 500 }
    );
  }
}

// POST /api/stock/transactions - Enregistrer une nouvelle transaction
export async function POST(request) {
  try {
    const data = await request.json();
    const {
      item_id,
      transaction_type,
      quantity: rawQuantity,
      source_location_id,
      destination_location_id,
      reference,
      user_id,
      notes
    } = data;

    // Conversion explicite en nombre
    const quantity = Number(rawQuantity);

    // Vérifications de base
    if (!item_id || !transaction_type || isNaN(quantity)) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Commencer une transaction
    await query('BEGIN');

    try {
      // 1. Vérifier l'article et récupérer son prix unitaire
      const itemResult = await query(
        'SELECT quantity::numeric, unit_price FROM inventory_items WHERE id = $1',
        [item_id]
      );

      if (itemResult.rows.length === 0) {
        throw new Error('Item not found');
      }

      const currentQuantity = Number(itemResult.rows[0].quantity);
      const unit_price = Number(itemResult.rows[0].unit_price);

      // 2. Calculer la nouvelle quantité
      let newQuantity;
      switch (transaction_type) {
        case 'in':
        case 'adjustment_up':
          newQuantity = currentQuantity + Math.abs(quantity);
          break;
        case 'out':
        case 'adjustment_down':
          newQuantity = currentQuantity - Math.abs(quantity);
          if (newQuantity < 0) {
            throw new Error('Insufficient stock');
          }
          break;
        default:
          throw new Error('Invalid transaction type');
      }

      // 3. Créer la transaction avec quantité absolue
      const transactionResult = await query(
        `INSERT INTO inventory_transactions (
          item_id,
          transaction_type,
          quantity,
          unit_price,
          source_location_id,
          destination_location_id,
          reference,
          user_id,
          notes,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        RETURNING *`,
        [
          item_id,
          transaction_type,
          Math.abs(quantity),
          unit_price,
          source_location_id,
          destination_location_id,
          reference,
          user_id,
          notes
        ]
      );

      // 4. Mettre à jour le stock avec la nouvelle quantité calculée
      await query(
        'UPDATE inventory_items SET quantity = $1 WHERE id = $2',
        [newQuantity, item_id]
      );

      // 5. Si des emplacements sont spécifiés, mettre à jour leurs quantités
      if (source_location_id) {
        await query(
          `UPDATE inventory_item_locations 
           SET quantity = GREATEST(0, quantity::numeric - $1::numeric)
           WHERE item_id = $2 AND location_id = $3`,
          [Math.abs(quantity), item_id, source_location_id]
        );
      }

      if (destination_location_id) {
        await query(
          `INSERT INTO inventory_item_locations (item_id, location_id, quantity)
           VALUES ($1, $2, $3)
           ON CONFLICT (item_id, location_id) 
           DO UPDATE SET quantity = inventory_item_locations.quantity::numeric + $3::numeric`,
          [item_id, destination_location_id, Math.abs(quantity)]
        );
      }

      await query('COMMIT');

      // Récupérer les détails complets de la transaction
      const completeTransaction = await query(
        `SELECT 
          t.*,
          src.name as source_location_name,
          dst.name as destination_location_name,
          u.firstname || ' ' || u.lastname as user_name
        FROM inventory_transactions t
        LEFT JOIN inventory_locations src ON t.source_location_id = src.id
        LEFT JOIN inventory_locations dst ON t.destination_location_id = dst.id
        LEFT JOIN users u ON t.user_id = u.id
        WHERE t.id = $1`,
        [transactionResult.rows[0].id]
      );

      return NextResponse.json(completeTransaction.rows[0]);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating transaction' },
      { status: 500 }
    );
  }
}