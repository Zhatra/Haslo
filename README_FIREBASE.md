# Configuración de Firebase para Haslo

Este documento explica cómo configurar Firebase para la aplicación Haslo.

## Requisitos previos

1. Tener una cuenta de Google
2. Acceso a [Firebase Console](https://console.firebase.google.com/)

## Pasos para configurar Firebase

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Añadir proyecto"
3. Ingresa "haslo-app" como nombre del proyecto
4. Sigue los pasos para crear el proyecto (puedes desactivar Google Analytics si no lo necesitas)

### 2. Configurar Autenticación

1. En el panel lateral de Firebase Console, haz clic en "Authentication"
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method", habilita el proveedor "Correo electrónico/contraseña"
4. Guarda los cambios

### 3. Configurar Firestore Database

1. En el panel lateral, haz clic en "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Selecciona la ubicación del servidor más cercana a tus usuarios
5. Haz clic en "Habilitar"

### 4. Registrar tu aplicación web

1. En la página de inicio del proyecto, haz clic en el icono de web (</>) para añadir una aplicación web
2. Ingresa "haslo-web" como nombre de la aplicación
3. Marca la casilla "También configurar Firebase Hosting para esta aplicación" si deseas usar el hosting de Firebase
4. Haz clic en "Registrar aplicación"
5. Firebase te mostrará un objeto de configuración como este:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### 5. Actualizar la configuración en la aplicación

1. Copia el objeto `firebaseConfig` que te proporciona Firebase
2. Abre el archivo `src/services/firebaseConfig.js` en tu proyecto
3. Reemplaza el objeto `firebaseConfig` existente con el que copiaste

## Estructura de datos en Firestore

La aplicación Haslo utiliza la siguiente estructura de datos en Firestore:

```
/users/{userId}/tasks/{taskId}
```

Donde:
- `{userId}` es el ID único del usuario autenticado
- `{taskId}` es el ID único de cada tarea

Cada documento de tarea tiene la siguiente estructura:

```javascript
{
  title: "Título de la tarea",
  completed: false,
  createdAt: "2023-10-25T15:30:00.000Z",
  duration: 25 // Duración en minutos
}
```

## Reglas de seguridad recomendadas

Para proteger tus datos, configura las siguientes reglas de seguridad en Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Estas reglas permiten que los usuarios solo puedan leer y escribir sus propios datos.

## Solución de problemas comunes

### Error "Firebase: Error (auth/...)"

Si ves errores de autenticación, verifica:
- Que has habilitado el método de autenticación por correo/contraseña
- Que estás usando un correo electrónico válido
- Que la contraseña cumple con los requisitos mínimos (al menos 6 caracteres)

### Error "Missing or insufficient permissions"

Si ves este error, verifica:
- Que has configurado correctamente las reglas de seguridad
- Que el usuario está autenticado antes de intentar leer/escribir datos
- Que estás accediendo a la ruta correcta en Firestore

### Error "FirebaseError: Firebase: No Firebase App '[DEFAULT]' has been created"

Este error ocurre cuando intentas usar Firebase antes de inicializarlo. Asegúrate de que:
- El archivo `firebaseConfig.js` se importa correctamente
- La inicialización de Firebase ocurre antes de cualquier uso de sus servicios

## Recursos adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de autenticación de Firebase](https://firebase.google.com/docs/auth/web/start)
- [Guía de Firestore](https://firebase.google.com/docs/firestore/quickstart) 