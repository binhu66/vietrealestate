-- Market statistics RPC functions for /api/stats endpoint
-- Used by price heatmaps, ROI analysis, and AI market queries

-- Average price per m² by city
CREATE OR REPLACE FUNCTION stats_price_by_city(
  p_tx_type   text DEFAULT NULL,
  p_category  text DEFAULT NULL
)
RETURNS TABLE (
  tinh_thanh    text,
  avg_price_m2  numeric,  -- VND per m²
  avg_price     numeric,  -- total avg price
  listing_count bigint,
  median_area   numeric
) LANGUAGE sql STABLE AS $$
  SELECT
    tinh_thanh,
    ROUND(AVG(list_price / NULLIF(building_area_total, 0))) AS avg_price_m2,
    ROUND(AVG(list_price))                                  AS avg_price,
    COUNT(*)                                                AS listing_count,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY building_area_total)) AS median_area
  FROM listings
  WHERE standard_status = 'Active'
    AND list_price > 0
    AND building_area_total > 0
    AND tinh_thanh IS NOT NULL
    AND (p_tx_type  IS NULL OR transaction_type = p_tx_type)
    AND (p_category IS NULL OR category         = p_category)
  GROUP BY tinh_thanh
  ORDER BY listing_count DESC
  LIMIT 30;
$$;

-- Average price per m² by district within a city
CREATE OR REPLACE FUNCTION stats_price_by_district(
  p_city      text DEFAULT 'TP. Hồ Chí Minh',
  p_tx_type   text DEFAULT 'For Sale',
  p_category  text DEFAULT NULL
)
RETURNS TABLE (
  quan_huyen    text,
  avg_price_m2  numeric,
  avg_price     numeric,
  listing_count bigint,
  lat           double precision,
  lng           double precision
) LANGUAGE sql STABLE AS $$
  SELECT
    quan_huyen,
    ROUND(AVG(list_price / NULLIF(building_area_total, 0))) AS avg_price_m2,
    ROUND(AVG(list_price))                                  AS avg_price,
    COUNT(*)                                                AS listing_count,
    AVG(lat)                                                AS lat,
    AVG(lng)                                                AS lng
  FROM listings
  WHERE standard_status = 'Active'
    AND list_price > 0
    AND building_area_total > 0
    AND tinh_thanh = p_city
    AND quan_huyen IS NOT NULL
    AND transaction_type = p_tx_type
    AND (p_category IS NULL OR category = p_category)
  GROUP BY quan_huyen
  ORDER BY listing_count DESC
  LIMIT 50;
$$;

-- Average price by property category
CREATE OR REPLACE FUNCTION stats_price_by_category(
  p_city text DEFAULT NULL
)
RETURNS TABLE (
  category      text,
  transaction_type text,
  avg_price_m2  numeric,
  avg_price     numeric,
  listing_count bigint,
  min_price     numeric,
  max_price     numeric
) LANGUAGE sql STABLE AS $$
  SELECT
    category,
    transaction_type,
    ROUND(AVG(list_price / NULLIF(building_area_total, 0))) AS avg_price_m2,
    ROUND(AVG(list_price))                                  AS avg_price,
    COUNT(*)                                                AS listing_count,
    ROUND(MIN(list_price))                                  AS min_price,
    ROUND(MAX(list_price))                                  AS max_price
  FROM listings
  WHERE standard_status = 'Active'
    AND list_price > 0
    AND category IS NOT NULL
    AND (p_city IS NULL OR tinh_thanh = p_city)
  GROUP BY category, transaction_type
  ORDER BY listing_count DESC;
$$;

-- Overall market summary
CREATE OR REPLACE FUNCTION stats_market_summary()
RETURNS TABLE (
  total_active      bigint,
  total_for_sale    bigint,
  total_for_rent    bigint,
  avg_sale_price    numeric,
  avg_rent_monthly  numeric,
  cities_count      bigint,
  vip_count         bigint
) LANGUAGE sql STABLE AS $$
  SELECT
    COUNT(*) FILTER (WHERE standard_status = 'Active')                           AS total_active,
    COUNT(*) FILTER (WHERE transaction_type = 'For Sale' AND standard_status = 'Active') AS total_for_sale,
    COUNT(*) FILTER (WHERE transaction_type = 'For Rent' AND standard_status = 'Active') AS total_for_rent,
    ROUND(AVG(list_price) FILTER (WHERE transaction_type = 'For Sale' AND standard_status = 'Active' AND list_price > 0)) AS avg_sale_price,
    ROUND(AVG(list_price) FILTER (WHERE transaction_type = 'For Rent' AND standard_status = 'Active' AND list_price > 0)) AS avg_rent_monthly,
    COUNT(DISTINCT tinh_thanh) FILTER (WHERE standard_status = 'Active')         AS cities_count,
    COUNT(*) FILTER (WHERE vip_level > 0 AND standard_status = 'Active')         AS vip_count
  FROM listings;
$$;
