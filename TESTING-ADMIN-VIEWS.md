# 🧪 Guía de Validación - Admin Views

Esta guía te ayudará a validar que todos los endpoints de admin-views funcionen correctamente.

---

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener:

1. ✅ **Backend corriendo:** `npm run start:dev`
2. ✅ **Vistas creadas en Oracle:** Ejecutar `src/modules/admin-views/oracle-views.sql`
3. ✅ **Usuario con rol ADMIN:** Tener credenciales de administrador
4. ✅ **Datos de prueba:** Tener información en las tablas de Oracle

---

## 🎯 Opción 1: Validación Automática con Script de Node.js

### **Método más rápido y completo**

1. **Ejecutar el script de prueba:**

```bash
node test-admin-views.js "CC_ADMIN" "PASSWORD_ADMIN"
```

**Ejemplo:**
```bash
node test-admin-views.js "123456789" "admin123"
```

2. **Resultados esperados:**

El script probará automáticamente:
- ✓ Login y autenticación
- ✓ Todos los endpoints de detalle de productos
- ✓ Todos los endpoints de consumo de materiales
- ✓ Todos los endpoints de alertas de stock
- ✓ Todos los endpoints de tareas atrasadas
- ✓ Validación de seguridad (sin token)

3. **Interpretación de resultados:**

```
✓ Test pasó correctamente
✗ Test falló
```

Si todos los tests pasan, verás:
```
✓ TODAS LAS PRUEBAS PASARON EXITOSAMENTE
```

---

## 📬 Opción 2: Validación Manual con Postman

### **Paso 1: Importar la colección**

1. Abre Postman
2. Click en **"Import"**
3. Arrastra el archivo: `postman-collection-admin-views.json`
4. La colección **"TailorFlow - Admin Views"** aparecerá

### **Paso 2: Configurar variables (Automáticas)**

La colección ya tiene configuradas las variables:
- `base_url`: `http://localhost:3000`
- `token`: Se llenará automáticamente después del login

### **Paso 3: Hacer Login**

1. Abrir: **0. Authentication → Login - Get Token**
2. Editar el Body con tus credenciales:
   ```json
   {
     "cc": "TU_CC_ADMIN",
     "password": "TU_PASSWORD"
   }
   ```
3. Click en **"Send"**
4. **El token se guarda automáticamente** ✅

### **Paso 4: Probar los endpoints**

Ahora puedes ejecutar cualquier endpoint en cualquier orden:

#### **1. Detalle de Productos**
- `GET Todos los Productos` - Ver todos los productos
- `GET Producto por ID` - Ver un producto específico (edita el ID en la URL)

#### **2. Consumo de Materiales**
- `GET Todo el Consumo` - Ver consumo de todos los materiales
- `GET Consumo por Área` - Ver consumo de un área (edita el área en la URL)

#### **3. Alertas de Stock**
- `GET Todas las Alertas` - Ver todas las alertas de stock
- `GET Alertas Críticas` - Ver solo las críticas (diferencia negativa)

#### **4. Tareas Atrasadas**
- `GET Todas las Tareas Atrasadas` - Ver todas las tareas
- `GET Tareas por Área` - Filtrar por área (edita el área en la URL)
- `GET Tareas por Días` - Filtrar por días (edita el número en la URL)

---

## 🔍 Opción 3: Validación con cURL (Terminal)

### **Paso 1: Obtener el token**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cc":"123456789","password":"admin123"}' \
  | jq -r '.data.access_token'
```

Copia el token que se imprime.

### **Paso 2: Probar endpoints**

Reemplaza `<TOKEN>` con el token copiado:

```bash
# Detalle de productos
curl -X GET http://localhost:3000/admin-views/detalle-productos \
  -H "Authorization: Bearer <TOKEN>" | jq

# Consumo de materiales
curl -X GET http://localhost:3000/admin-views/consumo-materiales \
  -H "Authorization: Bearer <TOKEN>" | jq

# Alertas de stock
curl -X GET http://localhost:3000/admin-views/alertas-stock \
  -H "Authorization: Bearer <TOKEN>" | jq

# Tareas atrasadas
curl -X GET http://localhost:3000/admin-views/tareas-atrasadas \
  -H "Authorization: Bearer <TOKEN>" | jq
```

---

## ❌ Solución de Problemas Comunes

### **Error: ECONNREFUSED**
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```

**Solución:** El backend no está corriendo
```bash
npm run start:dev
```

---

### **Error 401: Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Causas posibles:**
1. Token incorrecto o expirado
2. Token no enviado en el header

**Solución:** Hacer login de nuevo y copiar el nuevo token

---

### **Error 403: Forbidden**
```json
{
  "statusCode": 403,
  "message": "No tienes permiso para acceder a este recurso. Tu rol es: EMPLOYEE"
}
```

**Causa:** El usuario no tiene rol ADMIN

**Solución:** Usar credenciales de un usuario con rol `ADMIN`

---

### **Error 404: Not Found**
```json
{
  "statusCode": 404,
  "message": "No se encontraron productos en el sistema"
}
```

**Causas posibles:**
1. Las vistas no están creadas en Oracle
2. No hay datos en las tablas

**Solución:**
1. Ejecutar el archivo `src/modules/admin-views/oracle-views.sql` en Oracle
2. Verificar que haya datos en las tablas:
   ```sql
   SELECT * FROM VW_DETALLE_PRODUCTO;
   SELECT * FROM VW_CONSUMO_MATERIALES;
   SELECT * FROM VW_ALERTA_STOCK_MINIMO;
   SELECT * FROM VW_TAREAS_ATRASADAS;
   ```

---

### **Error 500: Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**Causas posibles:**
1. Las vistas no existen en Oracle
2. Error de conexión a la base de datos
3. Configuración incorrecta en variables de entorno

**Solución:**
1. Revisar los logs del backend para ver el error específico
2. Verificar variables de entorno (.env):
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `SERVICE_NAME`
   - `DB_SCHEMA`
3. Ejecutar el script SQL de las vistas

---

## 📊 Verificar que las Vistas Existan en Oracle

Conéctate a Oracle y ejecuta:

```sql
-- Verificar si las vistas existen
SELECT view_name
FROM all_views
WHERE view_name IN (
  'VW_DETALLE_PRODUCTO',
  'VW_CONSUMO_MATERIALES',
  'VW_ALERTA_STOCK_MINIMO',
  'VW_TAREAS_ATRASADAS'
);
```

Deberías ver las 4 vistas listadas. Si no aparecen:

```sql
-- Ejecutar el archivo oracle-views.sql
@src/modules/admin-views/oracle-views.sql
```

---

## ✅ Checklist de Validación

Marca cada item que valides:

### Configuración
- [ ] Backend corriendo en puerto 3000
- [ ] Vistas creadas en Oracle
- [ ] Tengo credenciales de ADMIN
- [ ] Hay datos de prueba en las tablas

### Autenticación
- [ ] Login funciona y obtengo token
- [ ] El usuario tiene rol ADMIN
- [ ] El token es válido

### Endpoints - Detalle de Productos
- [ ] GET `/admin-views/detalle-productos` funciona
- [ ] GET `/admin-views/detalle-productos/:id` funciona

### Endpoints - Consumo de Materiales
- [ ] GET `/admin-views/consumo-materiales` funciona
- [ ] GET `/admin-views/consumo-materiales/area/:area` funciona

### Endpoints - Alertas de Stock
- [ ] GET `/admin-views/alertas-stock` funciona
- [ ] GET `/admin-views/alertas-stock/critico` funciona

### Endpoints - Tareas Atrasadas
- [ ] GET `/admin-views/tareas-atrasadas` funciona
- [ ] GET `/admin-views/tareas-atrasadas/area/:area` funciona
- [ ] GET `/admin-views/tareas-atrasadas/dias/:dias` funciona

### Seguridad
- [ ] Endpoints rechazan requests sin token (401)
- [ ] Endpoints rechazan usuarios sin rol ADMIN (403)

---

## 📝 Reportar Problemas

Si encuentras errores:

1. **Revisa los logs del backend:**
   ```bash
   # En la terminal donde corre el backend
   # Verás los errores detallados
   ```

2. **Documenta el error:**
   - Endpoint que falla
   - Código de error (401, 403, 404, 500)
   - Mensaje de error
   - Logs del backend

3. **Verifica:**
   - ¿Las vistas existen en Oracle?
   - ¿Hay datos en las tablas?
   - ¿El usuario es ADMIN?
   - ¿El backend está corriendo?

---

## 🎉 Validación Exitosa

Si todo funciona, deberías poder:

✅ Hacer login y obtener token
✅ Ver el detalle de todos los productos
✅ Ver el consumo de materiales por área
✅ Ver alertas de stock bajo
✅ Ver tareas atrasadas
✅ Filtrar por ID, área, días, etc.

**¡Felicidades! Los endpoints de admin-views están funcionando correctamente.** 🚀

---

## 📚 Recursos Adicionales

- **Documentación del módulo:** `src/modules/admin-views/README.md`
- **Scripts SQL:** `src/modules/admin-views/oracle-views.sql`
- **Colección de Postman:** `postman-collection-admin-views.json`
- **Script de prueba:** `test-admin-views.js`

---

**Desarrollado para TailorFlow Backend**
