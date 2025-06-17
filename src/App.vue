<template>
  <div class="app" :style="backgroundStyle">
    <div class="app__overlay">
      <div class="app__container">
        <header class="app__header">
          <h1 class="app__title">Haslo</h1>
          <SettingsPanel @update-background="updateBackground" />
        </header>
        
        <main class="app__main">
          <div v-if="!user" class="app__auth">
            <AuthComponent :user="user" @auth-change="handleAuthChange" />
          </div>
          
          <div v-else class="app__content">
            <TaskList
              :tasks="tasks"
              :selected-task="selectedTask"
              :is-loading="isLoading"
              @add="addTask"
              @update="updateTask"
              @delete="deleteTask"
              @select="selectTask"
            />
            
            <FocusTimer
              v-if="selectedTask"
              :task="selectedTask"
              @complete="handleTimerComplete"
              @duration-change="updateTaskDuration"
              @reset="resetTimer"
            />
          </div>
        </main>
        
        <footer class="app__footer">
          <p>{{ user ? `Conectado como ${user.displayName || user.email}` : 'No has iniciado sesión' }}</p>
          <button v-if="user" @click="logout" class="app__logout-btn">Cerrar sesión</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
// Importaciones de componentes y servicios
import { ref, computed, onMounted, watch } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import TaskList from './components/TaskList.vue';
import FocusTimer from './components/FocusTimer.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import AuthComponent from './components/AuthComponent.vue';
import { getTasks, saveTask, removeTask } from './services/taskService';

export default {
  name: 'App',
  components: {
    TaskList,
    FocusTimer,
    SettingsPanel,
    AuthComponent
  },
  setup() {
    // Estado reactivo (Vue.js)
    const tasks = ref([]);
    const selectedTask = ref(null);
    const backgroundOpacity = ref(0.8);
    const user = ref(null);
    const isLoading = ref(false);
    const auth = getAuth();
    
    // Computed property para el estilo de fondo
    const backgroundStyle = computed(() => ({
      backgroundImage: `url(${new URL('./assets/goforit.png', import.meta.url).href})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      '--bg-opacity': backgroundOpacity.value
    }));
    
    // Método para cargar tareas (demuestra async/await)
    const loadTasks = async () => {
      try {
        isLoading.value = true;
        const loadedTasks = await getTasks();
        tasks.value = loadedTasks;
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Métodos para gestionar tareas
    const addTask = async (task) => {
      try {
        isLoading.value = true;
        console.log('Intentando agregar tarea:', task);
        
        // Verificar si el usuario está autenticado
        if (!auth.currentUser) {
          console.error('No se puede agregar la tarea: usuario no autenticado');
          alert('Debes iniciar sesión para agregar tareas');
          isLoading.value = false;
          return;
        }
        
        const savedTask = await saveTask(task);
        console.log('Tarea guardada exitosamente:', savedTask);
        tasks.value.push(savedTask);
      } catch (error) {
        console.error('Error al agregar tarea:', error);
        alert('Error al agregar la tarea. Por favor, intenta de nuevo.');
      } finally {
        isLoading.value = false;
      }
    };
    
    const updateTask = async (task) => {
      try {
        isLoading.value = true;
        const updatedTask = await saveTask(task);
        const index = tasks.value.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }
        
        // Si la tarea actualizada es la seleccionada, actualizar también la referencia
        if (selectedTask.value && selectedTask.value.id === updatedTask.id) {
          selectedTask.value = updatedTask;
        }
      } catch (error) {
        console.error('Error al actualizar tarea:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    const deleteTask = async (taskId) => {
      try {
        isLoading.value = true;
        await removeTask(taskId);
        tasks.value = tasks.value.filter(task => task.id !== taskId);
        
        // Si la tarea eliminada es la seleccionada, limpiar la selección
        if (selectedTask.value && selectedTask.value.id === taskId) {
          selectedTask.value = null;
        }
      } catch (error) {
        console.error('Error al eliminar tarea:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    const selectTask = (task) => {
      selectedTask.value = task;
    };
    
    const handleTimerComplete = (task) => {
      updateTask({
        ...task,
        completed: true
      });
    };
    
    const updateTaskDuration = (taskId, duration) => {
      const task = tasks.value.find(t => t.id === taskId);
      if (task) {
        updateTask({
          ...task,
          duration
        });
      }
    };
    
    const resetTimer = () => {
      // Implementación de reseteo del temporizador
      console.log('Temporizador reiniciado');
    };
    
    // Actualizar la opacidad del fondo
    const updateBackground = (opacity) => {
      backgroundOpacity.value = opacity;
    };
    
    // Manejar cambios de autenticación
    const handleAuthChange = (currentUser) => {
      console.log('Cambio de autenticación detectado:', currentUser);
      user.value = currentUser;
      
      if (currentUser) {
        console.log('Usuario autenticado, cargando tareas...');
        loadTasks();
      } else {
        console.log('Usuario desconectado, limpiando tareas...');
        tasks.value = [];
        selectedTask.value = null;
      }
    };
    
    // Cerrar sesión
    const logout = async () => {
      try {
        await signOut(auth);
        user.value = null;
        tasks.value = [];
        selectedTask.value = null;
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };
    
    // Lifecycle hook - onMounted
    onMounted(() => {
      console.log('Componente App montado');
      
      // Escuchar cambios en la autenticación
      onAuthStateChanged(auth, (currentUser) => {
        console.log('Estado de autenticación cambiado:', currentUser ? `Usuario: ${currentUser.email}` : 'No autenticado');
        user.value = currentUser;
        
        // Cargar tareas cuando el estado de autenticación cambia
        if (currentUser) {
          loadTasks();
        } else {
          tasks.value = [];
          selectedTask.value = null;
        }
      });
      
      // Escuchar eventos del temporizador
      document.addEventListener('reset-timer', () => {
        console.log('Temporizador reiniciado desde el componente web');
      });
    });
    
    return {
      tasks,
      selectedTask,
      backgroundStyle,
      user,
      isLoading,
      addTask,
      updateTask,
      deleteTask,
      selectTask,
      handleTimerComplete,
      updateTaskDuration,
      resetTimer,
      updateBackground,
      handleAuthChange,
      logout
    };
  }
};
</script>

<style lang="scss">
@use './styles/variables' as *;
@use './styles/mixins' as mixins;
@use './styles/main';

.app {
  min-height: 100vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, var(--bg-opacity, 0.8));
    backdrop-filter: blur(10px);
    z-index: 0;
  }
  
  &__overlay {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-lg;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xl;
  }
  
  &__title {
    font-size: 2.5rem;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin: 0;
    letter-spacing: -1px;
  }
  
  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  &__auth {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  
  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  &__footer {
    margin-top: $spacing-xl;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: $color-gray;
  }
  
  &__logout-btn {
    background: none;
    border: none;
    color: $color-primary;
    cursor: pointer;
    font-size: 0.875rem;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    
    &:hover {
      background-color: rgba($color-primary, 0.1);
    }
  }
}
</style> 