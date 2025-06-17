<template>
  <div class="task-list glass">
    <h2 class="task-list__title">Mis tareas</h2>
    
    <div v-if="isLoading" class="task-list__loading">
      <div class="loader"></div>
      <p>Cargando tareas...</p>
    </div>
    
    <div v-else-if="!tasks.length" class="task-list__empty">
      <p>No hay tareas pendientes</p>
      <p v-if="!isUserLoggedIn" class="task-list__login-prompt">
        Inicia sesión para sincronizar tus tareas
      </p>
    </div>
    
    <ul v-else class="task-list__items">
      <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :selected="selectedTask && selectedTask.id === task.id"
        @select="$emit('select', task)"
        @update="$emit('update', $event)"
        @delete="$emit('delete', task.id)"
      />
    </ul>
    
    <div class="task-list__form">
      <input
        type="text"
        v-model="newTaskTitle"
        @keyup.enter="addTask"
        placeholder="Nueva tarea..."
        class="task-list__input"
        autocomplete="off"
      />
      <button @click="addTask" class="btn btn--accent task-list__add-btn">
        <span class="material-icons">add</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import TaskItem from './TaskItem.vue';
import { auth } from '../services/firebaseConfig';

export default {
  name: 'TaskList',
  components: {
    TaskItem
  },
  props: {
    tasks: {
      type: Array,
      required: true
    },
    selectedTask: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['add', 'update', 'delete', 'select'],
  
  setup(props, { emit }) {
    // Estado local
    const newTaskTitle = ref('');
    
    // Computed property para verificar si el usuario está autenticado
    const isUserLoggedIn = computed(() => {
      return !!auth.currentUser;
    });
    
    // Método para agregar una nueva tarea
    const addTask = () => {
      console.log('Botón de agregar tarea presionado');
      
      if (!isUserLoggedIn.value) {
        console.log('Usuario no autenticado, no se puede agregar tarea');
        alert('Debes iniciar sesión para agregar tareas');
        return;
      }
      
      if (newTaskTitle.value.trim()) {
        const newTask = {
          title: newTaskTitle.value.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
          duration: 25 // Duración predeterminada en minutos
        };
        
        console.log('Emitiendo evento add con la nueva tarea:', newTask);
        emit('add', newTask);
        newTaskTitle.value = '';
      } else {
        console.log('Título de tarea vacío, no se agrega');
      }
    };
    
    return {
      newTaskTitle,
      isUserLoggedIn,
      addTask
    };
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as mixins;

.task-list {
  @include mixins.liquid-glass();
  width: 100%;
  max-width: 500px;
  padding: $spacing-lg;
  margin-bottom: $spacing-lg;
  
  &__title {
    margin-top: 0;
    margin-bottom: $spacing-lg;
    text-align: center;
    color: $color-dark;
  }
  
  &__items {
    list-style: none;
    padding: 0;
    margin: 0 0 $spacing-lg;
    max-height: 300px;
    overflow-y: auto;
    position: relative;
    z-index: 1;
    
    /* Estilizar scrollbar */
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: $border-radius-pill;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba($color-primary, 0.5);
      border-radius: $border-radius-pill;
    }
  }
  
  &__form {
    display: flex;
    gap: $spacing-sm;
    position: relative;
    z-index: 5;
  }
  
  &__input {
    flex: 1;
    padding: $spacing-sm;
    border: none;
    border-radius: $border-radius-sm;
    background-color: rgba(255, 255, 255, 0.5);
    color: $color-dark;
    font-size: 1rem;
    height: 40px;
    
    &::placeholder {
      color: rgba($color-dark, 0.5);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.3);
      background-color: rgba(255, 255, 255, 0.8);
    }
  }
  
  &__add-btn {
    padding: $spacing-xs;
    border-radius: $border-radius-sm;
    background-color: $color-primary;
    color: white;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .material-icons {
      font-size: 20px;
    }
    
    &:hover {
      background-color: darken($color-primary, 10%);
    }
  }
  
  &__empty {
    text-align: center;
    padding: $spacing-lg 0;
    color: $color-gray;
  }
  
  &__login-prompt {
    font-size: 0.9rem;
    color: $color-primary;
    margin-top: $spacing-sm;
  }
  
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg 0;
    
    .loader {
      width: 40px;
      height: 40px;
      border: 3px solid rgba($color-primary, 0.3);
      border-top-color: $color-primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: $spacing-sm;
    }
    
    p {
      color: $color-gray;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 