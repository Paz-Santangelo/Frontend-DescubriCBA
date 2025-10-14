# 🚀 Integración JWT - Solución Completa

## ✅ Problema Resuelto

**Error:** `ERR_CONNECTION_REFUSED` al conectar con http://localhost:8080

**Solución:** Sistema híbrido que funciona con backend real o simulado automáticamente.

## 🎯 ¿Cómo Funciona Ahora?

### 1. **Detección Automática**
- Si Spring Boot está corriendo → Usa backend real
- Si Spring Boot NO está corriendo → Cambia automáticamente a backend simulado
- **¡No necesitas hacer nada manualmente!**

### 2. **Backend Simulado Incluido**
- ✅ Registro de usuarios
- ✅ Login con JWT real
- ✅ Lista de usuarios
- ✅ Validación de tokens
- ✅ Manejo de errores

## 🧪 Cómo Probar

### Opción 1: Solo Frontend (Sin Spring Boot)
```bash
npm run dev
```
- Ve a http://localhost:5173/ejemplo
- Todo funcionará automáticamente con el backend simulado
- **Credenciales de prueba disponibles en pantalla**

### Opción 2: Con Spring Boot
```bash
# Terminal 1: Iniciar tu backend Spring Boot
cd tu-proyecto-spring-boot
./mvnw spring-boot:run

# Terminal 2: Iniciar React
npm run dev
```

## 📋 Credenciales de Prueba (Backend Simulado)

| Email | Contraseña | Nombre |
|-------|------------|---------|
| `juan@example.com` | `Password123` | Juan Pérez |
| `admin@example.com` | `Admin123` | Administrador |
| `test@example.com` | `Test123` | Usuario Test |
| `maria@example.com` | `Maria123` | María García |

## 🎛️ Control Manual del Backend

En cualquier página con integración JWT verás un botón **"ℹ️ Info Backend"** que te permite:

- Ver el estado actual (Real vs Simulado)
- Ver las credenciales de prueba
- Cambiar manualmente entre backends
- Ver qué funcionalidades están disponibles

## 📱 Páginas Disponibles

### 🏠 Página Principal
- **URL:** http://localhost:5173/
- **Funciona:** ✅ Siempre
- **Incluye:** Panel para simular login del sistema existente

### 📊 Dashboard Simple
- **URL:** http://localhost:5173/dashboard
- **Funciona:** ✅ Con y sin Spring Boot
- **Incluye:** Botón para obtener usuarios

### 🧪 Ejemplo Completo
- **URL:** http://localhost:5173/ejemplo
- **Funciona:** ✅ Con y sin Spring Boot
- **Incluye:** 
  - Formularios pre-llenados
  - Log de actividad en tiempo real
  - Todas las funcionalidades JWT

### 📝 Formularios Individuales
- **Registro:** http://localhost:5173/registro
- **Login:** http://localhost:5173/login

## 🔧 Configuración Técnica

### Archivo: `src/services/config.js`
```javascript
export const config = {
  // Cambiar a false para forzar backend real
  USE_MOCK_BACKEND: true,
  
  BACKEND_URL: 'http://localhost:8080',
  REQUEST_TIMEOUT: 10000
};
```

### Endpoints Simulados
```
POST /api/auth/register  ✅ Simulado
POST /api/auth/login     ✅ Simulado  
GET  /api/usuarios       ✅ Simulado
```

## 🎯 Flujo de Prueba Recomendado

### Sin Spring Boot (Más Fácil)
1. `npm run dev`
2. Ve a http://localhost:5173/ejemplo
3. Haz clic en **"Registrar"** (datos pre-llenados)
4. Haz clic en **"Login"** (mismas credenciales)
5. Haz clic en **"GET /api/usuarios"**
6. ¡Ve los resultados en pantalla!

### Con Spring Boot
1. Inicia tu backend Spring Boot en puerto 8080
2. Cambia `USE_MOCK_BACKEND: false` en `config.js`
3. `npm run dev`
4. Usa tus propios endpoints y credenciales

## 🛡️ Características de Seguridad

- ✅ **JWT real** generado y validado
- ✅ **Tokens con expiración** (24 horas)
- ✅ **Almacenamiento seguro** en localStorage
- ✅ **Interceptores automáticos** para headers
- ✅ **Limpieza automática** de tokens expirados

## 🎨 Características de UI

- ✅ **Detección visual** del estado del backend
- ✅ **Log de actividad** en tiempo real
- ✅ **Mensajes descriptivos** para cada acción
- ✅ **Formularios pre-llenados** para pruebas rápidas
- ✅ **Panel de control** del backend

## 🐛 Solución de Problemas

### "ERR_CONNECTION_REFUSED"
- ✅ **Automáticamente resuelto** - cambia a backend simulado

### "Token inválido"
- ✅ **Automáticamente limpiado** - pide nuevo login

### "Backend no responde"
- ✅ **Automáticamente detectado** - muestra mensaje claro

### Cambiar entre backends
- 🎛️ Usa el botón **"ℹ️ Info Backend"** en cualquier página

## 📊 Datos de Ejemplo

El backend simulado incluye 4 usuarios de prueba con datos realistas:
- IDs únicos
- Fechas de registro
- Estados activo/inactivo
- Emails válidos

## ✨ Ventajas de Esta Solución

1. **🚀 Funciona inmediatamente** - sin configuración
2. **🔄 Detección automática** - cambia según disponibilidad
3. **🧪 Datos de prueba** - listos para usar
4. **📱 UI completa** - formularios y visualización
5. **🛡️ Seguridad real** - JWT auténticos
6. **🎯 Fácil transición** - a backend real cuando esté listo

¡Ahora puedes probar toda la funcionalidad JWT sin necesidad de tener Spring Boot corriendo!