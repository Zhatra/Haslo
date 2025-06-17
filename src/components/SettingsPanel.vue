<template>
  <div class="settings-panel">
    <button class="settings-panel__toggle" @click="togglePanel">
      <span class="material-icons">settings</span>
    </button>
    
    <div class="settings-panel__content glass" v-if="isPanelOpen">
      <h3 class="settings-panel__title">Configuración</h3>
      
      <!-- Sección de autenticación -->
      <div class="settings-panel__section">
        <h4 class="settings-panel__subtitle">Cuenta</h4>
        
        <div v-if="currentUser" class="settings-panel__user-info">
          <div class="settings-panel__user-avatar">
            <img :src="currentUser.photoURL || 'https://via.placeholder.com/40'" alt="Avatar">
          </div>
          <div class="settings-panel__user-details">
            <p class="settings-panel__user-name">{{ currentUser.displayName }}</p>
            <p class="settings-panel__user-email">{{ currentUser.email }}</p>
          </div>
        </div>
        
        <div v-else class="settings-panel__auth-buttons">
          <p>Inicia sesión para sincronizar tus tareas</p>
          <button class="btn btn--google" @click="signInWithGoogle">
            <span class="google-icon"></span>
            Iniciar sesión con Google
          </button>
        </div>
      </div>
      
      <!-- Sección de apariencia -->
      <div class="settings-panel__section">
        <h4 class="settings-panel__subtitle">Apariencia</h4>
        
        <div class="settings-panel__option">
          <label for="transparency">Transparencia de ventanas:</label>
          <input 
            type="range" 
            id="transparency" 
            min="0.1" 
            max="1.0" 
            step="0.1" 
            v-model="transparency" 
            @input="updateBackgroundOpacity"
            class="settings-panel__slider"
          >
        </div>
      </div>
      
      <div class="settings-panel__footer">
        <p class="settings-panel__version">Haslo v0.1.0</p>
        
        <div class="settings-panel__logout-container" v-if="currentUser">
          <button class="btn btn--outline btn--logout" @click="signOut">
            <span class="material-icons">logout</span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'SettingsPanel',
  emits: ['update-background'],
  
  setup(props, { emit }) {
    const isPanelOpen = ref(false);
    const transparency = ref(0.8);
    const currentUser = ref(null);
    const auth = getAuth();
    
    // Método para alternar la visibilidad del panel
    const togglePanel = () => {
      isPanelOpen.value = !isPanelOpen.value;
    };
    
    // Método para actualizar la opacidad del fondo
    const updateBackgroundOpacity = () => {
      emit('update-background', transparency.value);
    };
    
    // Método para iniciar sesión con Google
    const signInWithGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
        alert('No se pudo iniciar sesión. Inténtalo de nuevo más tarde.');
      }
    };
    
    // Método para cerrar sesión
    const signOut = async () => {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };
    
    // Observar cambios en el estado de autenticación
    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user;
      });
    });
    
    return {
      isPanelOpen,
      transparency,
      currentUser,
      togglePanel,
      updateBackgroundOpacity,
      signInWithGoogle,
      signOut
    };
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as mixins;
@use "sass:color";

.settings-panel {
  position: relative;
  
  &__toggle {
    background-color: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all $transition-normal;
    position: relative;
    z-index: 10;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
      transform: rotate(30deg);
    }
    
    .material-icons {
      font-size: 24px;
      color: $color-dark;
    }
  }
  
  &__content {
    position: absolute;
    top: 50px;
    right: 0;
    width: 300px;
    padding: $spacing-lg;
    z-index: 100;
    box-shadow: $box-shadow-lg;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  &__title {
    margin-bottom: $spacing-md;
    text-align: center;
  }
  
  &__section {
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
  
  &__subtitle {
    font-size: 1rem;
    margin-bottom: $spacing-sm;
    color: $color-gray;
  }
  
  &__option {
    display: flex;
    flex-direction: column;
    margin-bottom: $spacing-sm;
    
    label {
      margin-bottom: $spacing-xs;
      font-size: 0.9rem;
    }
    
    input[type="range"] {
      width: 100%;
      height: 20px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255, 255, 255, 0.3);
      border-radius: $border-radius-pill;
      outline: none;
      cursor: pointer;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: $color-primary;
        cursor: pointer;
        z-index: 10;
        position: relative;
      }
      
      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: $color-primary;
        cursor: pointer;
        z-index: 10;
        position: relative;
        border: none;
      }
    }
  }
  
  &__user-info {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-md;
  }
  
  &__user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: $spacing-sm;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  &__user-details {
    flex: 1;
  }
  
  &__user-name {
    font-weight: $font-weight-medium;
    margin: 0;
  }
  
  &__user-email {
    font-size: 0.8rem;
    color: $color-gray;
    margin: 0;
  }
  
  &__auth-buttons {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    
    p {
      font-size: 0.9rem;
      margin-bottom: $spacing-sm;
    }
  }
  
  &__footer {
    text-align: center;
    margin-top: $spacing-lg;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    position: relative;
    z-index: 200;
  }
  
  &__version {
    font-size: 0.8rem;
    color: $color-gray;
    margin: 0;
  }
  
  &__logout-container {
    width: 100%;
    margin-top: $spacing-md;
    position: relative;
    z-index: 250;
  }
}

.btn {
  &--google {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    background-color: #4285F4;
    color: white;
    
    &:hover {
      background-color: color.adjust(#4285F4, $lightness: -10%);
    }
    
    .google-icon {
      width: 18px;
      height: 18px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
  
  &--outline {
    background-color: transparent;
    border: 1px solid $color-primary;
    color: $color-primary;
    padding: $spacing-xs $spacing-sm;
    font-size: 0.8rem;
    
    &:hover {
      background-color: rgba($color-primary, 0.1);
    }
  }
  
  &--logout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-xs;
    padding: $spacing-sm;
    font-weight: $font-weight-medium;
    position: relative;
    z-index: 250;
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.2);
    
    .material-icons {
      font-size: 18px;
    }
    
    &:hover {
      background-color: rgba($color-primary, 0.2);
      color: darken($color-primary, 10%);
    }
  }
}
</style> 