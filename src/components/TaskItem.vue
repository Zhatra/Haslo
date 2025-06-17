<template>
  <li 
    class="task-item" 
    :class="{ 
      'task-item--completed': task.completed,
      'task-item--selected': selected
    }"
    @click="$emit('select', task)"
  >
    <div class="task-item__content">
      <div class="task-item__header">
        <input 
          type="checkbox"
          :checked="task.completed"
          @click.stop="toggleComplete"
          class="task-item__checkbox"
        />
        
        <h3 class="task-item__title">{{ task.title }}</h3>
      </div>
      
      <div class="task-item__details">
        <span class="task-item__duration">
          <span class="material-icons">timer</span>
          {{ task.duration || 25 }} min
        </span>
        
        <span class="task-item__date" v-if="task.createdAt">
          {{ formatDate(task.createdAt) }}
        </span>
      </div>
    </div>
    
    <div class="task-item__actions">
      <button 
        class="task-item__btn task-item__btn--delete" 
        @click.stop="$emit('delete', task.id)"
        aria-label="Eliminar tarea"
      >
        <span class="material-icons">delete</span>
      </button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update', 'delete', 'select'],
  
  setup(props, { emit }) {
    // Método para alternar el estado completado
    const toggleComplete = () => {
      emit('update', {
        ...props.task,
        completed: !props.task.completed
      });
    };
    
    // Método para formatear la fecha
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    };
    
    return {
      toggleComplete,
      formatDate
    };
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  margin-bottom: $spacing-sm;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: $border-radius-md;
  transition: all $transition-normal;
  cursor: pointer;
  position: relative;
  z-index: 1;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  &--completed {
    opacity: 0.6;
    
    .task-item__title {
      text-decoration: line-through;
      color: $color-gray;
    }
  }
  
  &--selected {
    background-color: rgba($color-primary, 0.1);
    border-left: 3px solid $color-primary;
  }
  
  &__content {
    flex: 1;
    min-width: 0;
    pointer-events: auto;
  }
  
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-xs;
  }
  
  &__checkbox {
    margin-right: $spacing-sm;
    width: 18px;
    height: 18px;
    border-radius: $border-radius-sm;
    appearance: none;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba($color-primary, 0.3);
    position: relative;
    cursor: pointer;
    
    &:checked {
      background-color: $color-primary;
      border-color: $color-primary;
      
      &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 3px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
  }
  
  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: $font-weight-medium;
    color: $color-dark;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  &__details {
    display: flex;
    font-size: 0.8rem;
    color: $color-gray;
    gap: $spacing-md;
  }
  
  &__duration {
    display: flex;
    align-items: center;
    
    .material-icons {
      font-size: 14px;
      margin-right: 3px;
    }
  }
  
  &__date {
    font-style: italic;
  }
  
  &__actions {
    display: flex;
    gap: $spacing-xs;
  }
  
  &__btn {
    background: none;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all $transition-fast;
    color: $color-gray;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .material-icons {
      font-size: 18px;
    }
    
    &--delete:hover {
      color: $color-danger;
    }
  }
}
</style> 