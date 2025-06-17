<template>
  <div class="focus-timer">
    <h2 class="focus-timer__title">
      Enfoque en: <span>{{ task.title }}</span>
    </h2>
    
    <div class="focus-timer__display glass--card">
      <div class="focus-timer__time">{{ formattedTime }}</div>
      <div class="focus-timer__progress">
        <div 
          class="focus-timer__progress-bar" 
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
    
    <div class="focus-timer__controls">
      <button 
        @click="toggleTimer" 
        class="btn btn--glass" 
        :class="{ 'btn--accent': isRunning }"
      >
        {{ isRunning ? 'Pausar' : 'Iniciar' }}
      </button>
      
      <button 
        @click="resetTimer" 
        class="btn btn--glass"
        :disabled="!hasStarted"
      >
        Reiniciar
      </button>
    </div>
    
    <div class="focus-timer__duration-settings glass--nav">
      <h3>Duración</h3>
      <div class="focus-timer__duration-buttons">
        <button 
          v-for="duration in durations" 
          :key="duration.value"
          @click="setDuration(duration.value)"
          class="focus-timer__duration-btn"
          :class="{ 'focus-timer__duration-btn--active': currentDuration === duration.value }"
        >
          {{ duration.label }}
        </button>
      </div>
    </div>
    
    <!-- Audio element para el sonido de la campana zen -->
    <audio ref="zenSound" preload="auto">
      <source src="https://soundbible.com/mp3/tibetan-singing-bowl-daniel-simon.mp3" type="audio/mpeg">
      Tu navegador no soporta el elemento de audio.
    </audio>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'FocusTimer',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['timer-complete', 'update-duration'],
  setup(props, { emit }) {
    // Estado del temporizador
    const currentDuration = ref(props.task.duration || 25 * 60); // 25 minutos por defecto
    const timeRemaining = ref(currentDuration.value);
    const isRunning = ref(false);
    const hasStarted = ref(false);
    let timerInterval = null;
    const zenSound = ref(null);
    
    // Opciones de duración predefinidas
    const durations = [
      { label: '5 min', value: 5 * 60 },
      { label: '15 min', value: 15 * 60 },
      { label: '25 min', value: 25 * 60 },
      { label: '45 min', value: 45 * 60 }
    ];
    
    // Formatear el tiempo restante
    const formattedTime = computed(() => {
      const minutes = Math.floor(timeRemaining.value / 60);
      const seconds = timeRemaining.value % 60;
      
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
    
    // Calcular el porcentaje de progreso
    const progressPercentage = computed(() => {
      return ((currentDuration.value - timeRemaining.value) / currentDuration.value) * 100;
    });
    
    // Iniciar o pausar el temporizador
    const toggleTimer = () => {
      if (isRunning.value) {
        pauseTimer();
      } else {
        startTimer();
      }
    };
    
    // Iniciar el temporizador
    const startTimer = () => {
      if (!hasStarted.value) {
        hasStarted.value = true;
      }
      
      isRunning.value = true;
      
      timerInterval = setInterval(() => {
        if (timeRemaining.value > 0) {
          timeRemaining.value--;
        } else {
          completeTimer();
        }
      }, 1000);
    };
    
    // Pausar el temporizador
    const pauseTimer = () => {
      isRunning.value = false;
      clearInterval(timerInterval);
    };
    
    // Reiniciar el temporizador
    const resetTimer = () => {
      pauseTimer();
      timeRemaining.value = currentDuration.value;
      hasStarted.value = false;
    };
    
    // Completar el temporizador
    const completeTimer = () => {
      pauseTimer();
      
      // Reproducir el sonido de campana zen
      if (zenSound.value) {
        zenSound.value.currentTime = 0;
        zenSound.value.play()
          .catch(error => console.error('Error al reproducir el sonido:', error));
      }
      
      emit('timer-complete');
    };
    
    // Establecer una nueva duración
    const setDuration = (duration) => {
      currentDuration.value = duration;
      
      // Si el temporizador no está en marcha, actualizar también el tiempo restante
      if (!isRunning.value) {
        timeRemaining.value = duration;
      }
      
      // Emitir evento para actualizar la duración en la tarea
      emit('update-duration', Math.floor(duration / 60));
    };
    
    // Observar cambios en la tarea seleccionada
    watch(() => props.task, (newTask) => {
      // Si cambia la tarea, reiniciar el temporizador
      if (newTask.id !== props.task.id) {
        resetTimer();
        
        // Actualizar la duración según la nueva tarea
        if (newTask.duration) {
          currentDuration.value = newTask.duration;
          timeRemaining.value = newTask.duration;
        }
      }
    }, { deep: true });
    
    // Inicializar el temporizador con el valor correcto al montar el componente
    onMounted(() => {
      document.addEventListener('reset-timer', resetTimer);
      
      // Convertir minutos a segundos si es necesario
      if (props.task.duration && props.task.duration < 60) {
        currentDuration.value = props.task.duration * 60;
        timeRemaining.value = currentDuration.value;
      }
    });
    
    // Limpiar el intervalo y los event listeners al desmontar
    onBeforeUnmount(() => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      
      document.removeEventListener('reset-timer', resetTimer);
    });
    
    return {
      formattedTime,
      progressPercentage,
      isRunning,
      hasStarted,
      durations,
      currentDuration,
      toggleTimer,
      resetTimer,
      setDuration,
      zenSound
    };
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;
@use '../styles/mixins' as mixins;

.focus-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  
  &__title {
    margin-bottom: $spacing-lg;
    text-align: center;
    
    span {
      color: $color-primary;
      font-weight: $font-weight-bold;
    }
  }
  
  &__display {
    width: 100%;
    margin-bottom: $spacing-lg;
    padding: $spacing-lg;
  }
  
  &__time {
    font-size: 4rem;
    font-weight: $font-weight-bold;
    text-align: center;
    margin-bottom: $spacing-md;
    font-variant-numeric: tabular-nums;
    letter-spacing: -2px;
    background: linear-gradient(45deg, $color-primary, $color-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  &__progress {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: $border-radius-pill;
    overflow: hidden;
  }
  
  &__progress-bar {
    height: 100%;
    background: linear-gradient(90deg, $color-primary, $color-secondary);
    transition: width 1s linear;
    border-radius: $border-radius-pill;
    box-shadow: 0 0 10px rgba($color-primary, 0.5);
  }
  
  &__controls {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
    
    .btn {
      min-width: 100px;
    }
  }
  
  &__duration-settings {
    width: 100%;
    padding: $spacing-md;
    border-radius: $border-radius-lg;
    margin-top: $spacing-md;
    
    h3 {
      text-align: center;
      margin-bottom: $spacing-md;
      font-size: 1.1rem;
      color: $color-gray;
      font-weight: $font-weight-medium;
    }
  }
  
  &__duration-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $spacing-sm;
    position: relative;
    z-index: 5;
  }
  
  &__duration-btn {
    @include mixins.liquid-glass(0.5, 5px, $border-radius-pill);
    color: $color-gray;
    padding: $spacing-xs $spacing-md;
    cursor: pointer;
    border: none;
    font-weight: $font-weight-medium;
    position: relative;
    z-index: 10;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.7);
      color: $color-primary;
    }
    
    &--active {
      background: linear-gradient(90deg, rgba($color-primary, 0.7), rgba($color-secondary, 0.7));
      backdrop-filter: blur(10px);
      color: white;
      box-shadow: 0 2px 10px rgba($color-primary, 0.3);
    }
  }
}
</style> 