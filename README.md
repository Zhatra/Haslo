# Haslo - Aplicación de gestión de tareas

Haslo es una aplicación web para gestionar tareas con temporizador de enfoque, construida con Vue.js y Firebase.

## Características

- Autenticación de usuarios
- Creación, edición y eliminación de tareas
- Temporizador de enfoque (técnica Pomodoro)
- Sincronización en la nube con Firebase
- Interfaz moderna con efectos de vidrio (glassmorphism)

## Requisitos previos

- Node.js (v14 o superior)
- NPM o Yarn
- Cuenta de Firebase

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/haslo.git
cd haslo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita la autenticación por correo electrónico
3. Crea una base de datos Firestore
4. Obtén las credenciales de tu proyecto (apiKey, authDomain, etc.)
5. Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

Alternativamente, puedes editar directamente el archivo `src/services/firebaseConfig.js` con tus credenciales.

### 4. Configurar reglas de seguridad en Firestore

En la consola de Firebase, ve a Firestore > Reglas y establece las siguientes reglas:

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

### 5. Ejecutar el proyecto en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Estructura del proyecto

```
haslo/
├── src/
│   ├── assets/         # Imágenes y recursos estáticos
│   ├── components/     # Componentes Vue
│   ├── services/       # Servicios (Firebase, API, etc.)
│   ├── styles/         # Archivos SCSS
│   ├── utils/          # Utilidades y helpers
│   ├── App.vue         # Componente principal
│   └── main.js         # Punto de entrada
├── public/             # Archivos públicos
└── ...                 # Archivos de configuración
```

## Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos generados estarán en el directorio `dist/`.

Para desplegar en Firebase Hosting:

```bash
firebase login
firebase init hosting
firebase deploy
```

## Configuración de Variables de Entorno

Para ejecutar este proyecto, necesitarás configurar tus variables de entorno:

1. Crea un archivo `.env` en la raíz del proyecto
2. Copia el contenido de `.env.example` y reemplaza los valores con tus credenciales de Firebase
3. Asegúrate de que tu archivo `.env` esté incluido en `.gitignore` para no compartir tus credenciales

Ejemplo de archivo `.env`:
```
VITE_FIREBASE_API_KEY=tu_api_key_aquí
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain_aquí
...
```

## Licencia

[MIT](LICENSE) 