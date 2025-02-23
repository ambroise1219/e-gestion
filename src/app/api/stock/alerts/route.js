import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock/alerts - Récupérer les alertes
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    let sqlQuery = `
      WITH stock_levels AS (
        SELECT 
          i.id,
          i.name,
          i.reference,
          i.quantity,
          i.min_quantity,
          i.max_quantity,
          i.unit,
          CASE
            WHEN i.quantity::numeric <= i.min_quantity::numeric THEN 'critical'
            WHEN i.quantity::numeric <= (i.min_quantity::numeric * 1.2) THEN 'warning'
            WHEN i.quantity::numeric >= i.max_quantity::numeric AND i.max_quantity > 0 THEN 'overstock'
            ELSE 'normal'
          END as alert_level,
          CASE
            WHEN i.quantity::numeric <= i.min_quantity::numeric THEN 'high'
            WHEN i.quantity::numeric <= (i.min_quantity::numeric * 1.2) THEN 'medium'
            WHEN i.quantity::numeric >= i.max_quantity::numeric AND i.max_quantity > 0 THEN 'low'
            ELSE 'none'
          END as priority_level
        FROM inventory_items i
        WHERE i.status = 'active'
      )
      SELECT 
        sl.*,
        CASE 
          WHEN alert_level = 'critical' THEN 'Stock critique'
          WHEN alert_level = 'warning' THEN 'Stock bas'
          WHEN alert_level = 'overstock' THEN 'Surstock'
          ELSE 'Normal'
        END as alert_message,
        CASE
          WHEN alert_level = 'critical' THEN 'Niveau de stock en dessous du minimum'
          WHEN alert_level = 'warning' THEN 'Niveau de stock proche du minimum'
          WHEN alert_level = 'overstock' THEN 'Niveau de stock au-dessus du maximum'
          ELSE 'Niveau de stock normal'
        END as alert_description
      FROM stock_levels sl
      WHERE alert_level != 'normal'
    `;

    const queryParams = [];

    if (type) {
      sqlQuery += ` AND alert_level = $${queryParams.length + 1}`;
      queryParams.push(type);
    }

    if (priority) {
      sqlQuery += ` AND priority_level = $${queryParams.length + 1}`;
      queryParams.push(priority);
    }

    sqlQuery += ' ORDER BY CASE priority_level WHEN \'high\' THEN 1 WHEN \'medium\' THEN 2 WHEN \'low\' THEN 3 ELSE 4 END';

    const result = await query(sqlQuery, queryParams);

    // Grouper les alertes par type
    const alerts = {
      critical: result.rows.filter(row => row.alert_level === 'critical'),
      warning: result.rows.filter(row => row.alert_level === 'warning'),
      overstock: result.rows.filter(row => row.alert_level === 'overstock')
    };

    // Ajouter des statistiques
    const stats = {
      total_alerts: result.rows.length,
      critical_count: alerts.critical.length,
      warning_count: alerts.warning.length,
      overstock_count: alerts.overstock.length
    };

    return NextResponse.json({ alerts, stats });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Error fetching alerts' },
      { status: 500 }
    );
  }
}

// POST /api/stock/alerts/check - Vérifier et générer les alertes
export async function POST(request) {
  try {
    // Commencer une transaction
    await query('BEGIN');

    try {
      // 1. Vérifier les niveaux de stock bas
      const lowStockResult = await query(`
        INSERT INTO notifications (
          type,
          title,
          content,
          priority,
          metadata
        )
        SELECT 
          CASE 
            WHEN quantity::numeric <= min_quantity::numeric THEN 'stock_critical'
            ELSE 'stock_warning'
          END,
          CASE 
            WHEN quantity::numeric <= min_quantity::numeric THEN 'Stock critique'
            ELSE 'Stock bas'
          END,
          name || ' - ' || CASE 
            WHEN quantity::numeric <= min_quantity::numeric THEN 'Niveau critique'
            ELSE 'Niveau bas'
          END,
          CASE 
            WHEN quantity::numeric <= min_quantity::numeric THEN 'high'
            ELSE 'medium'
          END,
          json_build_object(
            'item_id', id,
            'current_quantity', quantity,
            'min_quantity', min_quantity,
            'unit', unit
          )
        FROM inventory_items
        WHERE quantity::numeric <= (min_quantity::numeric * 1.2)
          AND status = 'active'
        RETURNING id;
      `);

      // 2. Vérifier les surstocks
      const overstockResult = await query(`
        INSERT INTO notifications (
          type,
          title,
          content,
          priority,
          metadata
        )
        SELECT 
          'stock_overstock',
          'Surstock détecté',
          name || ' - Niveau au-dessus du maximum',
          'low',
          json_build_object(
            'item_id', id,
            'current_quantity', quantity,
            'max_quantity', max_quantity,
            'unit', unit
          )
        FROM inventory_items
        WHERE quantity::numeric > max_quantity::numeric
          AND max_quantity > 0
          AND status = 'active'
        RETURNING id;
      `);

      // 3. Vérifier les mouvements inhabituels
      const unusualMovementsResult = await query(`
        WITH daily_movements AS (
          SELECT 
            item_id,
            date_trunc('day', created_at) as day,
            SUM(CASE WHEN transaction_type = 'out' THEN quantity::numeric ELSE 0 END) as daily_consumption
          FROM inventory_transactions
          WHERE created_at >= NOW() - interval '30 days'
          GROUP BY item_id, date_trunc('day', created_at)
        ),
        movement_stats AS (
          SELECT
            item_id,
            AVG(daily_consumption) as avg_consumption,
            STDDEV(daily_consumption) as stddev_consumption
          FROM daily_movements
          GROUP BY item_id
        )
        INSERT INTO notifications (
          type,
          title,
          content,
          priority,
          metadata
        )
        SELECT 
          'unusual_movement',
          'Mouvement inhabituel détecté',
          i.name || ' - Consommation anormale',
          'medium',
          json_build_object(
            'item_id', i.id,
            'average_consumption', ms.avg_consumption,
            'current_consumption', dm.daily_consumption
          )
        FROM daily_movements dm
        JOIN movement_stats ms ON dm.item_id = ms.item_id
        JOIN inventory_items i ON dm.item_id = i.id
        WHERE dm.daily_consumption > ms.avg_consumption + (2 * ms.stddev_consumption)
          AND dm.day = date_trunc('day', NOW())
        RETURNING id;
      `);

      await query('COMMIT');

      return NextResponse.json({
        message: 'Alerts check completed',
        alerts_generated: {
          low_stock: lowStockResult.rows.length,
          overstock: overstockResult.rows.length,
          unusual_movements: unusualMovementsResult.rows.length
        }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
    return NextResponse.json(
      { error: 'Error checking alerts' },
      { status: 500 }
    );
  }
}