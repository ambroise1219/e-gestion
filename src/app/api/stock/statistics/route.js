import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/stock/statistics - Récupérer les statistiques globales du stock
export async function GET(req) {
  try {
    // Requête pour obtenir les statistiques globales
    const statsQuery = `
      WITH stock_stats AS (
        SELECT
          COUNT(*) as total_items,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_items_count,
          COUNT(CASE WHEN quantity <= min_quantity THEN 1 END) as low_stock_count,
          COUNT(CASE WHEN quantity >= max_quantity AND max_quantity > 0 THEN 1 END) as overstock_count,
          COALESCE(SUM(NULLIF(quantity, 0) * NULLIF(unit_price, 0)), 0) as total_value,
          COALESCE(
            AVG(
              CASE 
                WHEN status = 'active' AND max_quantity > 0 
                THEN (quantity::numeric / NULLIF(max_quantity, 0)::numeric) * 100
                ELSE NULL 
              END
            ), 
            0
          ) as avg_stock_level
        FROM inventory_items
        WHERE status != 'archived'
      ),
      movement_stats AS (
        SELECT
          COUNT(*) as total_movements,
          COUNT(CASE WHEN transaction_type = 'in' THEN 1 END) as incoming_count,
          COUNT(CASE WHEN transaction_type = 'out' THEN 1 END) as outgoing_count,
          COALESCE(
            AVG(
              CASE 
                WHEN transaction_type = 'out' AND t.unit_price IS NOT NULL 
                THEN quantity::numeric * t.unit_price::numeric
                ELSE NULL
              END
            ), 
            0
          ) as avg_movement_value
        FROM inventory_transactions t
        WHERE created_at >= NOW() - INTERVAL '30 days'
      ),
      turnover_calc AS (
        SELECT
          COALESCE(
            CASE 
              WHEN SUM(i.quantity) > 0 
              THEN (SUM(CASE WHEN t.transaction_type = 'out' THEN t.quantity ELSE 0 END)::numeric * 100.0) / NULLIF(SUM(i.quantity), 0)::numeric
              ELSE 0 
            END,
            0
          ) as turnover_rate
        FROM inventory_items i
        LEFT JOIN inventory_transactions t ON i.id = t.item_id
        WHERE i.status = 'active'
          AND (t.created_at >= NOW() - INTERVAL '30 days'
          OR t.created_at IS NULL)
      )
      SELECT
        s.*,
        m.total_movements,
        m.incoming_count,
        m.outgoing_count,
        m.avg_movement_value,
        t.turnover_rate
      FROM stock_stats s
      CROSS JOIN movement_stats m
      CROSS JOIN turnover_calc t
    `;

    const result = await query(statsQuery);

    // Retourner des statistiques par défaut si aucun résultat
    const defaultStats = {
      total_items: 0,
      active_items_count: 0,
      low_stock_count: 0,
      overstock_count: 0,
      total_value: 0,
      avg_stock_level: 0,
      total_movements: 0,
      incoming_count: 0,
      outgoing_count: 0,
      avg_movement_value: 0,
      turnover_rate: 0
    };

    return NextResponse.json(result.rows[0] || defaultStats);
  } catch (error) {
    console.error('Error fetching stock statistics:', error);
    return NextResponse.json(
      { error: 'Error fetching stock statistics' },
      { status: 500 }
    );
  }
}

// POST /api/stock/statistics/analyze - Analyser un article spécifique
export async function POST(request) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Requête pour analyser un article spécifique
    const analysisQuery = `
      WITH movement_history AS (
        SELECT
          DATE_TRUNC('day', created_at) as date,
          SUM(CASE WHEN transaction_type = 'out' THEN quantity ELSE 0 END) as daily_consumption,
          SUM(CASE WHEN transaction_type = 'in' THEN quantity ELSE 0 END) as daily_receipts
        FROM inventory_transactions
        WHERE item_id = $1
          AND created_at >= NOW() - INTERVAL '90 days'
        GROUP BY DATE_TRUNC('day', created_at)
      ),
      consumption_stats AS (
        SELECT
          COALESCE(AVG(daily_consumption), 0) as avg_daily_consumption,
          COALESCE(STDDEV(daily_consumption), 0) as stddev_consumption,
          COALESCE(AVG(daily_receipts), 0) as avg_daily_receipts,
          COUNT(DISTINCT date) as active_days
        FROM movement_history
      ),
      stock_levels AS (
        SELECT
          quantity,
          min_quantity,
          max_quantity,
          unit_price,
          CASE 
            WHEN quantity <= min_quantity THEN 'critical'
            WHEN quantity <= min_quantity * 1.2 THEN 'warning'
            WHEN quantity >= max_quantity THEN 'overstock'
            ELSE 'normal'
          END as stock_status
        FROM inventory_items
        WHERE id = $1
      )
      SELECT
        i.quantity as current_stock,
        i.min_quantity,
        i.max_quantity,
        cs.avg_daily_consumption,
        cs.stddev_consumption,
        cs.avg_daily_receipts,
        cs.active_days,
        CASE
          WHEN cs.avg_daily_consumption > 0 
          THEN i.quantity / cs.avg_daily_consumption
          ELSE null
        END as days_until_stockout,
        sl.stock_status,
        COALESCE(
          (SELECT SUM(quantity) 
           FROM inventory_transactions 
           WHERE item_id = $1 
             AND transaction_type = 'out'
             AND created_at >= NOW() - INTERVAL '30 days'
          ) * 100.0 / 
          NULLIF(i.quantity, 0),
          0
        ) as monthly_turnover_rate
      FROM inventory_items i
      CROSS JOIN consumption_stats cs
      CROSS JOIN stock_levels sl
      WHERE i.id = $1
    `;

    const result = await query(analysisQuery, [itemId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const analysis = result.rows[0];

    // Calculer les prédictions
    const predictions = {
      next_week_consumption: Math.round(analysis.avg_daily_consumption * 7),
      next_month_consumption: Math.round(analysis.avg_daily_consumption * 30),
      recommended_reorder_point: Math.round(
        analysis.avg_daily_consumption * 7 + // Une semaine de consommation
        (analysis.stddev_consumption * 2) // Marge de sécurité
      ),
      recommended_order_quantity: Math.round(
        (analysis.avg_daily_consumption * 30) - // Un mois de consommation
        analysis.current_stock // Moins le stock actuel
      )
    };

    return NextResponse.json({
      current_analysis: analysis,
      predictions
    });
  } catch (error) {
    console.error('Error analyzing item:', error);
    return NextResponse.json(
      { error: 'Error analyzing item' },
      { status: 500 }
    );
  }
}