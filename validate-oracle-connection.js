#!/usr/bin/env node

/**
 * Script para validar la conexión a Oracle
 *
 * Este script prueba:
 * 1. Que el backend esté corriendo
 * 2. Que el login funcione (usa Oracle)
 * 3. Que pueda consultar datos de Oracle (tabla ROLES)
 *
 * Uso:
 * node validate-oracle-connection.js <cc> <password>
 *
 * Ejemplo:
 * node validate-oracle-connection.js "123456789" "password123"
 */

const http = require('http');

// Configuración
const BASE_URL = 'localhost';
const PORT = 3000;
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Error: Se requieren credenciales');
  console.error('');
  console.error('Uso: node validate-oracle-connection.js <cc> <password>');
  console.error('');
  console.error('Ejemplo:');
  console.error('  node validate-oracle-connection.js "123456789" "password123"');
  process.exit(1);
}

const USER_CC = args[0];
const USER_PASSWORD = args[1];

// Colores
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
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

// Función para imprimir con estilo
function printStep(number, title, status, message = null, details = null) {
  const statusIcon = status === 'success' ? `${colors.green}✓${colors.reset}` :
                     status === 'error' ? `${colors.red}✗${colors.reset}` :
                     `${colors.yellow}⚠${colors.reset}`;

  console.log(`\n${colors.bright}[${number}] ${title}${colors.reset}`);
  console.log(`${statusIcon} ${message || ''}`);

  if (details) {
    console.log(`${colors.cyan}${details}${colors.reset}`);
  }
}

// Función principal
async function validateConnection() {
  console.log(`${colors.bright}${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║              VALIDACIÓN DE CONEXIÓN A ORACLE                               ║');
  console.log('║                    TailorFlow Backend                                      ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}\n`);

  console.log(`${colors.cyan}Configuración:${colors.reset}`);
  console.log(`  Base URL: http://${BASE_URL}:${PORT}`);
  console.log(`  Usuario CC: ${USER_CC}`);
  console.log(`  Password: ${'*'.repeat(USER_PASSWORD.length)}`);

  let allTestsPassed = true;

  // Test 1: Backend está corriendo
  try {
    printStep(1, 'Verificando que el backend esté corriendo', 'pending');

    const response = await makeRequest('GET', '/', null, null);

    if (response.statusCode === 200) {
      printStep(1, 'Backend corriendo', 'success', 'El servidor está activo y respondiendo');
    } else {
      printStep(1, 'Backend con problemas', 'warning', `Responde pero con status ${response.statusCode}`);
    }
  } catch (error) {
    printStep(1, 'Backend no responde', 'error', error.message);
    console.log(`\n${colors.red}${colors.bright}❌ EL BACKEND NO ESTÁ CORRIENDO${colors.reset}`);
    console.log(`\n${colors.yellow}Solución:${colors.reset}`);
    console.log('  Ejecuta: npm run start:dev');
    console.log('  Y vuelve a ejecutar este script\n');
    process.exit(1);
  }

  // Test 2: Conexión a Oracle mediante Login
  let token = null;
  try {
    printStep(2, 'Probando conexión a Oracle (Login)', 'pending');

    const response = await makeRequest('POST', '/auth/login', {
      cc: USER_CC,
      password: USER_PASSWORD,
    });

    if (response.statusCode === 200 && response.body.data && response.body.data.access_token) {
      token = response.body.data.access_token;
      const userName = response.body.data.employee?.name || 'N/A';
      const userRole = response.body.data.employee?.role?.name || 'N/A';

      printStep(
        2,
        'Conexión a Oracle exitosa',
        'success',
        '✓ El backend puede conectarse a Oracle y consultar datos',
        `  Usuario: ${userName}\n  Rol: ${userRole}`
      );
    } else if (response.statusCode === 401) {
      printStep(
        2,
        'Credenciales incorrectas',
        'warning',
        'La conexión a Oracle funciona, pero las credenciales son inválidas',
        '  Esto significa que Oracle está accesible'
      );
      console.log(`\n${colors.yellow}Nota:${colors.reset} La base de datos Oracle está funcionando.`);
      console.log('Solo necesitas usar credenciales correctas para continuar.\n');
      process.exit(0);
    } else {
      printStep(
        2,
        'Error al conectar con Oracle',
        'error',
        `Status: ${response.statusCode}`,
        JSON.stringify(response.body, null, 2)
      );
      allTestsPassed = false;
    }
  } catch (error) {
    printStep(2, 'Error de conexión', 'error', error.message);
    console.log(`\n${colors.red}${colors.bright}❌ NO SE PUEDE CONECTAR A ORACLE${colors.reset}`);
    console.log(`\n${colors.yellow}Posibles causas:${colors.reset}`);
    console.log('  1. Oracle no está corriendo');
    console.log('  2. Las variables de entorno están mal configuradas');
    console.log('  3. El firewall está bloqueando la conexión');
    console.log('  4. Las credenciales de la base de datos son incorrectas');
    console.log(`\n${colors.cyan}Variables de entorno requeridas:${colors.reset}`);
    console.log('  - DB_HOST');
    console.log('  - DB_PORT');
    console.log('  - DB_USERNAME');
    console.log('  - DB_PASSWORD');
    console.log('  - SERVICE_NAME');
    console.log('  - DB_SCHEMA\n');
    process.exit(1);
  }

  // Test 3: Consultar datos de Oracle (tabla ROLES)
  if (token) {
    try {
      printStep(3, 'Consultando datos de Oracle (tabla ROLES)', 'pending');

      const response = await makeRequest('GET', '/roles', null, token);

      if (response.statusCode === 200) {
        const rolesCount = Array.isArray(response.body.data) ? response.body.data.length : 0;

        printStep(
          3,
          'Consulta exitosa',
          'success',
          `✓ El backend puede leer datos de Oracle correctamente`,
          `  Roles encontrados: ${rolesCount}`
        );

        if (rolesCount > 0) {
          console.log(`\n${colors.cyan}Ejemplo de datos obtenidos:${colors.reset}`);
          console.log(JSON.stringify(response.body.data[0], null, 2));
        }
      } else if (response.statusCode === 403) {
        printStep(
          3,
          'Sin permisos para ver roles',
          'warning',
          'El usuario no tiene rol ADMIN, pero Oracle funciona correctamente',
          '  La conexión a Oracle está OK'
        );
      } else {
        printStep(
          3,
          'Error al consultar datos',
          'error',
          `Status: ${response.statusCode}`,
          JSON.stringify(response.body, null, 2)
        );
        allTestsPassed = false;
      }
    } catch (error) {
      printStep(3, 'Error en consulta', 'error', error.message);
      allTestsPassed = false;
    }
  }

  // Resumen final
  console.log(`\n${colors.bright}${colors.blue}${'═'.repeat(80)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}RESUMEN${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${'═'.repeat(80)}${colors.reset}\n`);

  if (allTestsPassed && token) {
    console.log(`${colors.green}${colors.bright}✓ CONEXIÓN A ORACLE VERIFICADA EXITOSAMENTE${colors.reset}\n`);
    console.log(`${colors.cyan}Estado de componentes:${colors.reset}`);
    console.log(`  ✓ Backend corriendo`);
    console.log(`  ✓ Conexión a Oracle funcionando`);
    console.log(`  ✓ Autenticación funcionando`);
    console.log(`  ✓ Consultas a tablas funcionando`);
    console.log('');
    console.log(`${colors.green}Ahora puedes probar los endpoints de admin-views:${colors.reset}`);
    console.log(`  node test-admin-views.js "${USER_CC}" "${USER_PASSWORD}"`);
    console.log('');
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bright}✗ HAY PROBLEMAS DE CONEXIÓN${colors.reset}\n`);
    console.log(`${colors.yellow}Revisa los mensajes de error arriba para más detalles.${colors.reset}\n`);
    process.exit(1);
  }
}

// Ejecutar validación
validateConnection().catch((error) => {
  console.error(`${colors.red}Error fatal: ${error.message}${colors.reset}`);
  console.error(error.stack);
  process.exit(1);
});
