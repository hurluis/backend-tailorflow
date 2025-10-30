-- ============================================================================
-- VISTAS DE ADMINISTRADOR PARA EL SISTEMA TAILORFLOW
-- ============================================================================
-- Este archivo contiene las definiciones de las vistas de Oracle que deben
-- estar creadas en la base de datos para que el módulo admin-views funcione.
--
-- IMPORTANTE: Estas vistas deben ejecutarse en Oracle con un usuario que
-- tenga permisos CREATE VIEW en el esquema correspondiente.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- VW_DETALLE_PRODUCTO
-- Vista que proporciona información completa de productos
-- Incluye: categoría, cliente, pedido, estado, área actual, empleado asignado
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW VW_DETALLE_PRODUCTO AS
SELECT
    p.id_product AS ID_PRODUCTO,
    p.name AS NOMBRE_PRODUCTO,
    cat.name AS CATEGORIA,
    c.name AS CLIENTE,
    o.id_order AS PEDIDO,
    s.name AS ESTADO_PRODUCTO,
    a.name AS AREA_ACTUAL,
    e.name AS EMPLEADO_ASIGNADO,
    TO_CHAR(t.start_date,'DD/MM/YYYY') AS FECHA_INICIO,
    TO_CHAR(t.end_date,'DD/MM/YYYY') AS FECHA_FIN,
    CASE
        WHEN t.end_date IS NOT NULL THEN 'COMPLETADA'
        WHEN t.start_date IS NOT NULL THEN 'EN PROCESO'
        ELSE 'PENDIENTE'
    END AS ESTADO_TAREA
FROM products p
JOIN category cat ON p.id_category = cat.id_category
JOIN orders o ON p.id_order = o.id_order
JOIN customer c ON o.id_customer = c.id_customer
LEFT JOIN tasks t ON p.id_product = t.id_product
LEFT JOIN employees e ON t.id_employee = e.id_employee
LEFT JOIN areas a ON t.id_area = a.id_area
LEFT JOIN states s ON p.id_state = s.id_state;

-- ----------------------------------------------------------------------------
-- VW_CONSUMO_MATERIALES
-- Vista que resume el consumo de materiales por área
-- Incluye: total consumido y número de tareas asociadas
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW VW_CONSUMO_MATERIALES AS
SELECT
    a.name AS AREA,
    m.name AS MATERIAL,
    SUM(mc.quantity) AS TOTAL_CONSUMIDO,
    COUNT(DISTINCT mc.id_task) AS TAREAS_ASOCIADAS
FROM material_consumption mc
JOIN materials m ON mc.id_material = m.id_material
JOIN areas a ON m.id_area = a.id_area
GROUP BY a.name, m.name;

-- ----------------------------------------------------------------------------
-- VW_ALERTA_STOCK_MINIMO
-- Vista de alertas para materiales con stock bajo el mínimo
-- Ordenada por stock actual ascendente para priorizar lo más crítico
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW VW_ALERTA_STOCK_MINIMO AS
SELECT
    m.name AS MATERIAL,
    a.name AS AREA_ASOCIADA,
    m.current_stock AS STOCK_ACTUAL,
    m.min_stock AS STOCK_MINIMO,
    (m.current_stock - m.min_stock) AS DIFERENCIA
FROM materials m
JOIN areas a ON m.id_area = a.id_area
WHERE m.current_stock <= m.min_stock
ORDER BY m.current_stock ASC;

-- ----------------------------------------------------------------------------
-- VW_TAREAS_ATRASADAS
-- Vista de tareas que están en proceso y llevan tiempo
-- Incluye: días en curso, área, empleado y producto afectado
-- Ordenada por días en curso descendente para priorizar las más antiguas
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW VW_TAREAS_ATRASADAS AS
SELECT
    t.id_task AS ID_TAREA,
    a.name AS AREA_PRODUCCION,
    e.name AS EMPLEADO_ASIGNADO,
    t.start_date AS FECHA_INICIO_REAL,
    TRUNC(SYSDATE - t.start_date) AS DIAS_EN_CURSO,
    p.id_product AS ID_PRODUCTO_AFECTADO
FROM tasks t
JOIN areas a ON t.id_area = a.id_area
LEFT JOIN employees e ON t.id_employee = e.id_employee
JOIN products p ON t.id_product = p.id_product
WHERE t.id_state = (SELECT id_state FROM states WHERE name = 'IN PROCESS')
ORDER BY DIAS_EN_CURSO DESC;

-- ============================================================================
-- COMANDOS DE VERIFICACIÓN
-- ============================================================================
-- Ejecute estos SELECT para verificar que las vistas funcionan correctamente:

-- Verificar vista de detalle de productos
SELECT * FROM VW_DETALLE_PRODUCTO;

-- Verificar vista de alertas de stock mínimo
SELECT * FROM VW_ALERTA_STOCK_MINIMO;

-- Verificar vista de consumo de materiales
SELECT * FROM VW_CONSUMO_MATERIALES;

-- Verificar vista de tareas atrasadas
SELECT * FROM VW_TAREAS_ATRASADAS;

-- ============================================================================
-- PERMISOS REQUERIDOS
-- ============================================================================
-- El usuario de la aplicación necesita permisos SELECT en estas vistas:
--
-- GRANT SELECT ON VW_DETALLE_PRODUCTO TO <usuario_app>;
-- GRANT SELECT ON VW_CONSUMO_MATERIALES TO <usuario_app>;
-- GRANT SELECT ON VW_ALERTA_STOCK_MINIMO TO <usuario_app>;
-- GRANT SELECT ON VW_TAREAS_ATRASADAS TO <usuario_app>;
-- ============================================================================
