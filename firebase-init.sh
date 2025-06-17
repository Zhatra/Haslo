#!/bin/bash

# Script para inicializar Firebase en el proyecto Haslo

echo "Inicializando Firebase en el proyecto Haslo..."

# Verificar si Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Iniciar sesión en Firebase (si no está ya iniciada)
firebase login

# Inicializar Firebase
echo "Selecciona tu proyecto Firebase y configura las características que necesitas:"
echo "- Firestore: para la base de datos"
echo "- Authentication: para la autenticación de usuarios"
echo "- Hosting (opcional): si quieres desplegar la aplicación"
echo ""

firebase init

# Configurar reglas de Firestore
echo "Configurando reglas de seguridad para Firestore..."
mkdir -p firestore
cat > firestore/firestore.rules << EOL
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOL

echo "Reglas de Firestore creadas en firestore/firestore.rules"

# Recordatorio para configurar el archivo .env
echo ""
echo "IMPORTANTE: No olvides crear un archivo .env en la raíz del proyecto con tus credenciales de Firebase:"
echo ""
echo "VITE_FIREBASE_API_KEY=tu_api_key"
echo "VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com"
echo "VITE_FIREBASE_PROJECT_ID=tu_proyecto"
echo "VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com"
echo "VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id"
echo "VITE_FIREBASE_APP_ID=tu_app_id"
echo "VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id"
echo ""
echo "O actualiza directamente src/services/firebaseConfig.js con tus credenciales."
echo ""
echo "Inicialización de Firebase completada." 