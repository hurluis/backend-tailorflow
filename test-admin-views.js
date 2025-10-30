#!/usr/bin/env node

/**
 * Script de validación para los endpoints de admin-views
 *
 * IMPORTANTE: Antes de ejecutar este script:
 * 1. El backend debe estar corriendo (npm run start:dev)
 * 2. Las vistas deben estar creadas en Oracle
 * 3. Debes tener un usuario con rol ADMIN
 *
 * Uso:
 * node test-admin-views.js <cc_admin> <password_admin>
 *
 * Ejemplo:
 * node test-admin-views.js "123456789" "admin123"
 */

const http = require('http');

// Configuración
const BASE_URL = 'localhost';
const PORT = 3000;
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Se requieren credenciales de administrador');
  console.error('');
  console.error('Uso: node test-admin-views.js <cc_admin> <password_admin>');
  console.error('');
  console.error('Ejemplo:');
  console.error('  node test-admin-views.js "123456789" "admin123"');
  process.exit(1);
}

const ADMIN_CC = args[0];
const ADMIN_PASSWORD = args[1];

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let token = null;
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

// Función helper para hacer peticiones HTTP
function makeRequest(method, path, body = null, authToken = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonData,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Función para imprimir resultados
function printTest(testName, passed, message, data = null) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    if (message) {
      console.log(`  ${colors.cyan}→${colors.reset} ${message}`);
    }
  } else {
    testResults.failed++;
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (message) {
      console.log(`  ${colors.red}→${colors.reset} ${message}`);
    }
  }
  if (data) {
    console.log(`  ${colors.yellow}Datos:${colors.reset}`, JSON.stringify(data, null, 2));
  }
  console.log('');
}

// Función para imprimir separadores
function printSection(title) {
  console.log('');
  console.log(`${colors.bright}${colors.blue}${'='.repeat(80)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'='.repeat(80)}${colors.reset}`);
  console.log('');
}

// Test 1: Login
async function testLogin() {
  printSection('TEST 1: LOGIN Y AUTENTICACIÓN');

  try {
    const response = await makeRequest('POST', '/auth/login', {
      cc: ADMIN_CC,
      password: ADMIN_PASSWORD,
    });

    if (response.statusCode === 200 && response.body.data && response.body.data.access_token) {
      token = response.body.data.access_token;
      const employeeName = response.body.data.employee?.name || 'N/A';
      const employeeRole = response.body.data.employee?.role?.name || 'N/A';

      printTest(
        'Login exitoso',
        true,
        `Usuario: ${employeeName} | Rol: ${employeeRole}`
      );

      if (employeeRole !== 'ADMIN') {
        printTest(
          'Verificación de rol ADMIN',
          false,
          `El usuario tiene rol ${employeeRole}, se requiere ADMIN`
        );
        return false;
      }

      printTest('Verificación de rol ADMIN', true, 'Usuario es administrador');
      return true;
    } else {
      printTest(
        'Login fallido',
        false,
        `Status: ${response.statusCode}`,
        response.body
      );
      return false;
    }
  } catch (error) {
    printTest('Login fallido', false, `Error: ${error.message}`);
    return false;
  }
}

// Test 2: Detalle de Productos
async function testDetalleProductos() {
  printSection('TEST 2: DETALLE DE PRODUCTOS');

  try {
    // Test 2.1: GET todos los productos
    const response = await makeRequest('GET', '/admin-views/detalle-productos', null, token);

    if (response.statusCode === 200) {
      const count = Array.isArray(response.body.data) ? response.body.data.length : 0;
      printTest(
        'GET /admin-views/detalle-productos',
        true,
        `${count} productos encontrados`
      );

      if (count > 0) {
        console.log(`  ${colors.cyan}Ejemplo de producto:${colors.reset}`);
        console.log(JSON.stringify(response.body.data[0], null, 2));
        console.log('');
      }
    } else if (response.statusCode === 404) {
      printTest(
        'GET /admin-views/detalle-productos',
        true,
        'No hay productos (404 es válido si la vista está vacía)',
        response.body
      );
    } else {
      printTest(
        'GET /admin-views/detalle-productos',
        false,
        `Status: ${response.statusCode}`,
        response.body
      );
    }

    // Test 2.2: GET producto por ID (si existe)
    if (response.statusCode === 200 && response.body.data.length > 0) {
      const productId = response.body.data[0].id_producto;
      const response2 = await makeRequest(
        'GET',
        `/admin-views/detalle-productos/${productId}`,
        null,
        token
      );

      if (response2.statusCode === 200) {
        printTest(
          `GET /admin-views/detalle-productos/${productId}`,
          true,
          'Producto específico obtenido correctamente'
        );
      } else {
        printTest(
          `GET /admin-views/detalle-productos/${productId}`,
          false,
          `Status: ${response2.statusCode}`,
          response2.body
        );
      }
    }
  } catch (error) {
    printTest('Detalle de productos', false, `Error: ${error.message}`);
  }
}

// Test 3: Consumo de Materiales
async function testConsumoMateriales() {
  printSection('TEST 3: CONSUMO DE MATERIALES');

  try {
    const response = await makeRequest('GET', '/admin-views/consumo-materiales', null, token);

    if (response.statusCode === 200) {
      const count = Array.isArray(response.body.data) ? response.body.data.length : 0;
      printTest(
        'GET /admin-views/consumo-materiales',
        true,
        `${count} registros de consumo encontrados`
      );

      if (count > 0) {
        console.log(`  ${colors.cyan}Ejemplo de consumo:${colors.reset}`);
        console.log(JSON.stringify(response.body.data[0], null, 2));
        console.log('');
      }
    } else if (response.statusCode === 404) {
      printTest(
        'GET /admin-views/consumo-materiales',
        true,
        'No hay consumo de materiales (404 es válido si la vista está vacía)',
        response.body
      );
    } else {
      printTest(
        'GET /admin-views/consumo-materiales',
        false,
        `Status: ${response.statusCode}`,
        response.body
      );
    }
  } catch (error) {
    printTest('Consumo de materiales', false, `Error: ${error.message}`);
  }
}

// Test 4: Alertas de Stock
async function testAlertasStock() {
  printSection('TEST 4: ALERTAS DE STOCK');

  try {
    // Test 4.1: Todas las alertas
    const response = await makeRequest('GET', '/admin-views/alertas-stock', null, token);

    if (response.statusCode === 200) {
      const count = Array.isArray(response.body.data) ? response.body.data.length : 0;
      printTest(
        'GET /admin-views/alertas-stock',
        true,
        `${count} alertas de stock encontradas`
      );

      if (count > 0) {
        console.log(`  ${colors.cyan}Ejemplo de alerta:${colors.reset}`);
        console.log(JSON.stringify(response.body.data[0], null, 2));
        console.log('');
      }
    } else {
      printTest(
        'GET /admin-views/alertas-stock',
        response.statusCode === 200,
        `Status: ${response.statusCode}`,
        response.body
      );
    }

    // Test 4.2: Alertas críticas
    const response2 = await makeRequest('GET', '/admin-views/alertas-stock/critico', null, token);

    if (response2.statusCode === 200) {
      const count = Array.isArray(response2.body.data) ? response2.body.data.length : 0;
      printTest(
        'GET /admin-views/alertas-stock/critico',
        true,
        `${count} alertas críticas encontradas`
      );
    } else {
      printTest(
        'GET /admin-views/alertas-stock/critico',
        false,
        `Status: ${response2.statusCode}`,
        response2.body
      );
    }
  } catch (error) {
    printTest('Alertas de stock', false, `Error: ${error.message}`);
  }
}

// Test 5: Tareas Atrasadas
async function testTareasAtrasadas() {
  printSection('TEST 5: TAREAS ATRASADAS');

  try {
    const response = await makeRequest('GET', '/admin-views/tareas-atrasadas', null, token);

    if (response.statusCode === 200) {
      const count = Array.isArray(response.body.data) ? response.body.data.length : 0;
      printTest(
        'GET /admin-views/tareas-atrasadas',
        true,
        `${count} tareas atrasadas encontradas`
      );

      if (count > 0) {
        console.log(`  ${colors.cyan}Ejemplo de tarea atrasada:${colors.reset}`);
        console.log(JSON.stringify(response.body.data[0], null, 2));
        console.log('');
      }
    } else {
      printTest(
        'GET /admin-views/tareas-atrasadas',
        response.statusCode === 200,
        `Status: ${response.statusCode}`,
        response.body
      );
    }
  } catch (error) {
    printTest('Tareas atrasadas', false, `Error: ${error.message}`);
  }
}

// Test 6: Autenticación - Sin token
async function testSinAutenticacion() {
  printSection('TEST 6: VALIDACIÓN DE SEGURIDAD');

  try {
    const response = await makeRequest('GET', '/admin-views/detalle-productos', null, null);

    if (response.statusCode === 401) {
      printTest(
        'Endpoint sin token (debe rechazar)',
        true,
        'Correctamente rechazado con 401 Unauthorized'
      );
    } else {
      printTest(
        'Endpoint sin token (debe rechazar)',
        false,
        `Esperaba 401, recibió ${response.statusCode}`,
        response.body
      );
    }
  } catch (error) {
    printTest('Validación sin autenticación', false, `Error: ${error.message}`);
  }
}

// Función principal
async function runTests() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                  SCRIPT DE VALIDACIÓN - ADMIN VIEWS                        ║');
  console.log('║                         TailorFlow Backend                                 ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
  console.log('');
  console.log(`${colors.yellow}Configuración:${colors.reset}`);
  console.log(`  Base URL: http://${BASE_URL}:${PORT}`);
  console.log(`  Admin CC: ${ADMIN_CC}`);
  console.log(`  Password: ${'*'.repeat(ADMIN_PASSWORD.length)}`);
  console.log('');

  const loginSuccess = await testLogin();

  if (!loginSuccess) {
    console.log('');
    console.log(`${colors.red}${colors.bright}❌ LOGIN FALLÓ - NO SE PUEDEN EJECUTAR MÁS PRUEBAS${colors.reset}`);
    console.log('');
    console.log(`${colors.yellow}Posibles causas:${colors.reset}`);
    console.log('  1. El backend no está corriendo');
    console.log('  2. Las credenciales son incorrectas');
    console.log('  3. El usuario no tiene rol ADMIN');
    console.log('');
    console.log(`${colors.cyan}Solución:${colors.reset}`);
    console.log('  - Verifica que el backend esté corriendo: npm run start:dev');
    console.log('  - Usa credenciales de un usuario con rol ADMIN');
    console.log('');
    process.exit(1);
  }

  await testDetalleProductos();
  await testConsumoMateriales();
  await testAlertasStock();
  await testTareasAtrasadas();
  await testSinAutenticacion();

  // Resumen final
  printSection('RESUMEN DE PRUEBAS');

  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(2);

  console.log(`${colors.bright}Total de pruebas:${colors.reset} ${testResults.total}`);
  console.log(`${colors.green}Exitosas:${colors.reset} ${testResults.passed}`);
  console.log(`${colors.red}Fallidas:${colors.reset} ${testResults.failed}`);
  console.log(`${colors.cyan}Tasa de éxito:${colors.reset} ${passRate}%`);
  console.log('');

  if (testResults.failed === 0) {
    console.log(`${colors.green}${colors.bright}✓ TODAS LAS PRUEBAS PASARON EXITOSAMENTE${colors.reset}`);
    console.log('');
    console.log(`${colors.cyan}Los endpoints de admin-views están funcionando correctamente.${colors.reset}`);
    console.log('');
  } else {
    console.log(`${colors.yellow}⚠ ALGUNAS PRUEBAS FALLARON${colors.reset}`);
    console.log('');
    console.log(`${colors.yellow}Posibles causas:${colors.reset}`);
    console.log('  1. Las vistas no están creadas en Oracle');
    console.log('  2. No hay datos en las tablas');
    console.log('  3. Hay errores en la configuración de la base de datos');
    console.log('');
    console.log(`${colors.cyan}Próximos pasos:${colors.reset}`);
    console.log('  1. Ejecutar oracle-views.sql en Oracle');
    console.log('  2. Verificar que haya datos de prueba en las tablas');
    console.log('  3. Revisar los logs del backend para más detalles');
    console.log('');
  }

  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Ejecutar tests
runTests().catch((error) => {
  console.error(`${colors.red}Error fatal: ${error.message}${colors.reset}`);
  process.exit(1);
});
