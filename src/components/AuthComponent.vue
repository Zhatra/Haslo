<template>
  <div class="auth-component">
    <div v-if="!user" class="auth-form">
      <h2>Iniciar sesión</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="tu@email.com" 
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="********" 
          required
        />
      </div>
      <div class="auth-buttons">
        <button 
          @click="login" 
          class="btn btn-primary" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Cargando...' : 'Iniciar sesión' }}
        </button>
        <button 
          @click="register" 
          class="btn btn-secondary" 
          :disabled="isLoading"
        >
          Registrarse
        </button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
    
    <div v-else class="user-info">
      <p>Conectado como: <strong>{{ user.email }}</strong></p>
      <button @click="logout" class="btn btn-outline">Cerrar sesión</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

export default {
  name: 'AuthComponent',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  emits: ['auth-change'],
  setup(props, { emit }) {
    const auth = getAuth();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const isLoading = ref(false);
    
    // Iniciar sesión
    const login = async () => {
      if (!email.value || !password.value) {
        errorMessage.value = 'Por favor, ingresa email y contraseña';
        return;
      }
      
      try {
        isLoading.value = true;
        errorMessage.value = '';
        
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log('Usuario autenticado:', userCredential.user);
        emit('auth-change', userCredential.user);
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        errorMessage.value = getErrorMessage(error.code);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Registrar nuevo usuario
    const register = async () => {
      if (!email.value || !password.value) {
        errorMessage.value = 'Por favor, ingresa email y contraseña';
        return;
      }
      
      if (password.value.length < 6) {
        errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }
      
      try {
        isLoading.value = true;
        errorMessage.value = '';
        
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        console.log('Usuario registrado:', userCredential.user);
        emit('auth-change', userCredential.user);
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        errorMessage.value = getErrorMessage(error.code);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Cerrar sesión
    const logout = async () => {
      try {
        isLoading.value = true;
        await signOut(auth);
        emit('auth-change', null);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        errorMessage.value = 'Error al cerrar sesión';
      } finally {
        isLoading.value = false;
      }
    };
    
    // Obtener mensaje de error legible
    const getErrorMessage = (errorCode) => {
      switch (errorCode) {
        case 'auth/invalid-email':
          return 'Email inválido';
        case 'auth/user-disabled':
          return 'Usuario deshabilitado';
        case 'auth/user-not-found':
          return 'Usuario no encontrado';
        case 'auth/wrong-password':
          return 'Contraseña incorrecta';
        case 'auth/email-already-in-use':
          return 'Este email ya está en uso';
        case 'auth/weak-password':
          return 'La contraseña es demasiado débil';
        default:
          return 'Error de autenticación';
      }
    };
    
    return {
      email,
      password,
      errorMessage,
      isLoading,
      login,
      register,
      logout
    };
  }
};
</script>

<style scoped lang="scss">
@use '../styles/variables' as *;

.auth-component {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: $border-radius-md;
  padding: $spacing-md;
  box-shadow: $box-shadow-md;
  max-width: 400px;
  margin: 0 auto;
}

.auth-form {
  h2 {
    margin-top: 0;
    margin-bottom: $spacing-md;
    color: $color-primary;
  }
}

.form-group {
  margin-bottom: $spacing-md;
  
  label {
    display: block;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-medium;
  }
  
  input {
    width: 100%;
    padding: $spacing-sm;
    border: 1px solid $color-gray-light;
    border-radius: $border-radius-sm;
    font-size: $font-size-base;
    
    &:focus {
      outline: none;
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.2);
    }
  }
}

.auth-buttons {
  display: flex;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}

.btn {
  padding: $spacing-sm $spacing-md;
  border-radius: $border-radius-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &-primary {
    background-color: $color-primary;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken($color-primary, 10%);
    }
  }
  
  &-secondary {
    background-color: $color-secondary;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken($color-secondary, 10%);
    }
  }
  
  &-outline {
    background-color: transparent;
    border: 1px solid $color-primary;
    color: $color-primary;
    
    &:hover:not(:disabled) {
      background-color: rgba($color-primary, 0.1);
    }
  }
}

.error-message {
  color: $color-danger;
  margin-top: $spacing-sm;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  p {
    margin: 0;
  }
}
</style> 