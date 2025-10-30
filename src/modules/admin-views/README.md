# Módulo Admin Views

Este módulo proporciona endpoints protegidos para acceder a vistas analíticas y de reportes del sistema TailorFlow. Todos los endpoints requieren autenticación JWT y rol de **ADMIN**.

## Características

- ✅ Protección completa con JWT y RolesGuard
- ✅ Acceso exclusivo para administradores
- ✅ Basado en vistas de Oracle para rendimiento óptimo
- ✅ DTOs validados con class-transformer
- ✅ Respuestas estandarizadas con BaseApplicationResponseDto
- ✅ Manejo de errores con excepciones de NestJS

## Vistas Implementadas

### 1. Detalle de Productos (VW_DETALLE_PRODUCTO)

Vista completa de productos con información de categoría, cliente, pedido, estado, área actual, empleado asignado y estado de tareas.

**Endpoints:**
- `GET /admin-views/detalle-productos` - Lista todos los productos
- `GET /admin-views/detalle-productos/:id` - Detalle de un producto específico

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Detalle de productos obtenido correctamente",
  "data": [
    {
      "id_producto": 1,
      "nombre_producto": "Camisa ejecutiva",
      "categoria": "Camisas",
      "cliente": "Empresa XYZ",
      "pedido": 100,
      "estado_producto": "En Producción",
      "area_actual": "Corte",
      "empleado_asignado": "Juan Pérez",
      "fecha_inicio": "15/01/2025",
      "fecha_fin": null,
      "estado_tarea": "EN PROCESO"
    }
  ]
}
```

---

### 2. Consumo de Materiales (VW_CONSUMO_MATERIALES)

Resumen de consumo de materiales agrupado por área, con totales consumidos y número de tareas asociadas.

**Endpoints:**
- `GET /admin-views/consumo-materiales` - Resumen completo de consumo
- `GET /admin-views/consumo-materiales/area/:area` - Consumo por área específica

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Consumo de materiales obtenido correctamente",
  "data": [
    {
      "area": "Corte",
      "material": "Tela algodón",
      "total_consumido": 150.5,
      "tareas_asociadas": 25
    }
  ]
}
```

---

### 3. Alertas de Stock Mínimo (VW_ALERTA_STOCK_MINIMO)

Alertas de materiales cuyo stock actual está en o bajo el nivel mínimo.

**Endpoints:**
- `GET /admin-views/alertas-stock` - Todas las alertas de stock
- `GET /admin-views/alertas-stock/critico` - Solo materiales con stock por debajo del mínimo (diferencia negativa)

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Alertas de stock obtenidas correctamente",
  "data": [
    {
      "material": "Hilo negro",
      "area_asociada": "Costura",
      "stock_actual": 5,
      "stock_minimo": 10,
      "diferencia": -5
    }
  ]
}
```

---

### 4. Tareas Atrasadas (VW_TAREAS_ATRASADAS)

Tareas que están en proceso y el tiempo que llevan en curso.

**Endpoints:**
- `GET /admin-views/tareas-atrasadas` - Todas las tareas en proceso
- `GET /admin-views/tareas-atrasadas/area/:area` - Tareas atrasadas por área
- `GET /admin-views/tareas-atrasadas/dias/:dias` - Tareas que exceden X días

**Respuesta:**
```json
{
  "statusCode": 200,
  "message": "Tareas atrasadas obtenidas correctamente",
  "data": [
    {
      "id_tarea": 45,
      "area_produccion": "Corte",
      "empleado_asignado": "María González",
      "fecha_inicio_real": "2025-01-10T00:00:00.000Z",
      "dias_en_curso": 20,
      "id_producto_afectado": 78
    }
  ]
}
```

---

## Autenticación

Todos los endpoints requieren:

1. **Token JWT** en el header `Authorization`:
   ```
   Authorization: Bearer <token>
   ```

2. **Rol de ADMIN**: El usuario autenticado debe tener el rol `ADMIN`

### Ejemplo de uso con cURL:

```bash
# Login para obtener token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cc": "admin_cc", "password": "admin_password"}'

# Usar token para consultar vistas
curl -X GET http://localhost:3000/admin-views/detalle-productos \
  -H "Authorization: Bearer <token_obtenido>"
```

---

## Manejo de Errores

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas o empleado inactivo"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "No tienes permiso para acceder a este recurso. Tu rol es: EMPLOYEE"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "No se encontraron productos en el sistema"
}
```

---

## Requisitos de Base de Datos

Las siguientes vistas deben estar creadas en Oracle antes de usar este módulo. Ver archivo `oracle-views.sql` para los scripts de creación:

- `VW_DETALLE_PRODUCTO`
- `VW_CONSUMO_MATERIALES`
- `VW_ALERTA_STOCK_MINIMO`
- `VW_TAREAS_ATRASADAS`

---

## Estructura del Módulo

```
admin-views/
├── admin-views.module.ts           # Módulo principal
├── admin-views.controller.ts       # Controlador con endpoints protegidos
├── admin-views.service.ts          # Lógica de negocio
├── entities/                       # Entidades TypeORM para vistas
│   ├── detalle-producto.view.ts
│   ├── consumo-materiales.view.ts
│   ├── alerta-stock-minimo.view.ts
│   └── tareas-atrasadas.view.ts
├── dto/                            # DTOs de respuesta
│   ├── detalle-producto-response.dto.ts
│   ├── consumo-materiales-response.dto.ts
│   ├── alerta-stock-minimo-response.dto.ts
│   └── tareas-atrasadas-response.dto.ts
├── oracle-views.sql                # Scripts SQL de las vistas
└── README.md                       # Esta documentación
```

---

## Notas Técnicas

1. **Sincronización**: Las entidades de vistas tienen `synchronize: false` para evitar que TypeORM intente modificarlas.

2. **Solo Lectura**: Las vistas son de solo lectura. No hay endpoints POST, PUT, PATCH o DELETE.

3. **Rendimiento**: Las vistas están optimizadas en Oracle con índices apropiados en las tablas subyacentes.

4. **Formato de Fechas**: Las fechas se formatean en Oracle como `DD/MM/YYYY` antes de ser devueltas.

5. **Valores NULL**: Los campos que pueden ser NULL (como `area_actual`, `empleado_asignado`, `fecha_fin`) se manejan correctamente en las consultas con LEFT JOIN.

---

## Desarrollado para TailorFlow

Módulo implementado siguiendo los estándares y patrones del proyecto TailorFlow.
