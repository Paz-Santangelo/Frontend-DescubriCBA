# Integración Frontend React con Backend Spring Boot

Este proyecto incluye una integración completa entre un frontend React y un backend Spring Boot con autenticación JWT.

## 🚀 Características Implementadas

### 1. Configuración de Axios
- Cliente HTTP configurado para http://localhost:8080
- Interceptores automáticos para agregar tokens JWT
- Manejo automático de errores de autenticación
- Timeout configurado a 10 segundos

### 2. Formulario de Registro
- Validación de campos (nombre, email, password)
- Validación de contraseña segura (mayúscula, número, 8+ caracteres)
- Confirmación de contraseña
- Manejo de errores del servidor
- Feedback visual para el usuario

### 3. Formulario de Login
- Validación de email y contraseña
- Almacenamiento automático del token JWT en localStorage
- Redirección después del login exitoso
- Manejo de errores de credenciales

### 4. Dashboard con Gestión de Usuarios
- Verificación automática de autenticación
- Botón para obtener usuarios desde /api/usuarios
- Manejo de errores de conexión y autorización
- Visualización de datos del backend
- Información técnica sobre la conexión

### 5. Servicios Implementados

#### AuthService (`src/services/authService.js`)
```javascript
// Registro de usuario
const result = await authService.register({
  nombre: "Juan Pérez",
  email: "juan@example.com", 
  password: "MiPassword123"
});

// Login
const result = await authService.login({
  email: "juan@example.com",
  password: "MiPassword123"
});

// Verificar autenticación
const isAuth = authService.isAuthenticated();

// Obtener token actual
const token = authService.getToken();

// Cerrar sesión
authService.logout();
```

#### UserService (`src/services/userService.js`)
```javascript
// Obtener todos los usuarios (requiere JWT)
const result = await userService.getAllUsers();

// Obtener usuario específico
const result = await userService.getUserById(123);

// Actualizar perfil
const result = await userService.updateProfile({
  nombre: "Nuevo Nombre"
});
```

## 🔧 Configuración del Backend Esperada

### Endpoints Necesarios en Spring Boot:

```java
// Registro de usuario
POST /api/auth/register
Content-Type: application/json
{
  "nombre": "string",
  "email": "string", 
  "password": "string"
}

// Login
POST /api/auth/login  
Content-Type: application/json
{
  "email": "string",
  "password": "string"
}
// Respuesta esperada:
{
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}

// Obtener usuarios (requiere Bearer token)
GET /api/usuarios
Authorization: Bearer <jwt_token>
```

## 🎯 Cómo Probar la Integración

### Opción 1: Dashboard Simple
1. **Iniciar el Proyecto**: `npm run dev`
2. **Ir al Dashboard**: http://localhost:5173/dashboard
3. **Flujo de Prueba**:
   - Registrarse en /registro
   - Hacer login en /login  
   - Ir a /dashboard y hacer clic en "Obtener Usuarios"

### Opción 2: Ejemplo Completo e Interactivo
1. **Ir al Ejemplo**: http://localhost:5173/ejemplo
2. **Probar Flujo Completo**:
   - **Registro**: Usar el formulario pre-llenado o modificar datos
   - **Login**: Usar las mismas credenciales
   - **Obtener Usuarios**: Hacer clic en "GET /api/usuarios"
   - **Ver Log**: Observar toda la actividad en tiempo real

### URLs Disponibles
- **Dashboard**: http://localhost:5173/dashboard
- **Ejemplo Interactivo**: http://localhost:5173/ejemplo
- **Registro**: http://localhost:5173/registro
- **Login**: http://localhost:5173/login

## 🔍 Manejo de Errores

### Errores de Conexión
- Si el backend no está corriendo, se muestra mensaje claro
- Verificación automática del estado del servidor

### Errores de Autenticación
- Token inválido o expirado: se limpia localStorage automáticamente
- Redirección automática al login cuando es necesario

### Errores de Validación
- Validación en tiempo real en formularios
- Mensajes específicos para cada campo

## 🛡️ Seguridad

### Token JWT
- Almacenado en localStorage
- Enviado automáticamente en headers Authorization
- Limpieza automática cuando expira

### Validaciones
- Email válido requerido
- Contraseñas seguras (mayúscula, número, longitud mínima)
- Sanitización de datos de entrada

## 📁 Estructura de Archivos

```
src/
├── services/
│   ├── apiClient.js         # Configuración base de Axios con interceptores JWT
│   ├── authService.js       # Servicio de autenticación JWT
│   └── userService.js       # Servicio de usuarios con endpoints protegidos
├── components/
│   ├── login/
│   │   └── LoginForm.jsx    # Formulario de login mejorado con JWT
│   ├── registro/
│   │   └── RegistroForm.jsx # Formulario de registro mejorado
│   ├── dashboard/
│   │   ├── Dashboard.jsx    # Componente principal del dashboard
│   │   └── Dashboard.css    # Estilos del dashboard
│   └── example/
│       ├── ExampleUsage.jsx # Ejemplo completo e interactivo
│       └── ExampleUsage.css # Estilos del ejemplo
└── pages/
    ├── dashboard/
    │   ├── DashboardPage.jsx # Página del dashboard
    │   └── DashboardPage.css # Estilos de la página
    └── example/
        └── ExamplePage.jsx   # Página del ejemplo interactivo
```

## 🎨 Características de UI

### Formularios
- Animaciones con Framer Motion
- Labels flotantes responsivos
- Validación visual en tiempo real
- Estados de loading

### Dashboard
- Diseño responsive
- Cards para mostrar usuarios
- Información técnica visible
- Estados de loading y error

### Ejemplo Interactivo
- Formularios pre-llenados para pruebas rápidas
- Log de actividad en tiempo real
- Estados visuales claros (éxito, error, info)
- Panel de estado de autenticación

### Navegación
- Links "Dashboard" y "Ejemplo JWT" en el navbar
- Accesible desde cualquier página
- Protección automática de rutas

## 🔧 Personalización

### Cambiar URL del Backend
Editar `src/services/apiClient.js`:
```javascript
const API_URL = "http://tu-servidor:puerto";
```

### Agregar Nuevos Endpoints
Crear nuevos métodos en los servicios existentes:
```javascript
// En userService.js
deleteUser: async (userId) => {
  const response = await apiClient.delete(`/api/usuarios/${userId}`);
  return response;
}
```

## 📝 Notas de Desarrollo

- Los comentarios explicativos están incluidos en todo el código
- Componentes funcionales con useState y useEffect
- Axios utilizado para todas las peticiones HTTP
- Manejo consistente de errores en toda la aplicación
- Responsive design implementado