import axios from 'axios';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// URL base para la API (en este caso, simulada)
const API_URL = 'https://api.example.com/tasks';

// Función para obtener todas las tareas del usuario actual
export async function getTasks() {
  try {
    const user = auth.currentUser;
    
    // Si no hay usuario autenticado, devolver array vacío
    if (!user) {
      console.log('No hay usuario autenticado, devolviendo array vacío');
      return [];
    }
    
    console.log('Obteniendo tareas para el usuario:', user.uid);
    
    // Obtener tareas del usuario actual
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const snapshot = await getDocs(tasksRef);
    
    // Convertir documentos a objetos de tarea
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Tareas obtenidas:', tasks.length);
    return tasks;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    
    // Fallback a localStorage si hay un error
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return tasks;
  }
}

// Función para guardar una tarea (crear o actualizar)
export async function saveTask(task) {
  try {
    const user = auth.currentUser;
    
    // Si no hay usuario autenticado, guardar en localStorage
    if (!user) {
      console.log('No hay usuario autenticado, guardando en localStorage');
      return saveTaskToLocalStorage(task);
    }
    
    console.log('Guardando tarea para el usuario:', user.uid, 'Tarea:', task);
    
    // Determinar si es una creación o actualización
    const isUpdate = !!task.id;
    
    if (isUpdate) {
      // Actualizar tarea existente
      const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
      await setDoc(taskRef, task, { merge: true });
      console.log('Tarea actualizada con ID:', task.id);
      return task;
    } else {
      // Crear nueva tarea
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      
      // Asegurarse de que la tarea tiene todos los campos necesarios
      const taskToSave = {
        title: task.title || 'Nueva tarea',
        completed: task.completed || false,
        createdAt: task.createdAt || new Date().toISOString(),
        duration: task.duration || 25
      };
      
      const docRef = await addDoc(tasksRef, taskToSave);
      console.log('Nueva tarea creada con ID:', docRef.id);
      
      return {
        ...taskToSave,
        id: docRef.id
      };
    }
  } catch (error) {
    console.error('Error al guardar tarea:', error);
    
    // Fallback a localStorage si hay un error
    return saveTaskToLocalStorage(task);
  }
}

// Función para eliminar una tarea
export async function removeTask(taskId) {
  try {
    const user = auth.currentUser;
    
    // Si no hay usuario autenticado, eliminar de localStorage
    if (!user) {
      console.log('No hay usuario autenticado, eliminando de localStorage');
      return removeTaskFromLocalStorage(taskId);
    }
    
    console.log('Eliminando tarea con ID:', taskId, 'para el usuario:', user.uid);
    
    // Eliminar tarea de Firestore
    const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await deleteDoc(taskRef);
    
    console.log('Tarea eliminada correctamente');
    return true;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    
    // Fallback a localStorage si hay un error
    return removeTaskFromLocalStorage(taskId);
  }
}

// Funciones de fallback para localStorage
function saveTaskToLocalStorage(task) {
  // Determinar si es una creación o actualización
  const isUpdate = !!task.id;
  
  // Obtener tareas existentes
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  if (isUpdate) {
    // Encontrar y actualizar la tarea existente
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index !== -1) {
      tasks[index] = task;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    return task;
  } else {
    // Crear nueva tarea con ID único
    const newTask = {
      ...task,
      id: Date.now().toString()
    };
    
    // Guardar en localStorage
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return newTask;
  }
}

function removeTaskFromLocalStorage(taskId) {
  // Obtener tareas existentes
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  // Filtrar la tarea a eliminar
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  
  // Guardar en localStorage
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
  return true;
}

// Ejemplo de cómo se usaría con axios en un entorno real
export async function getTasksFromRealAPI() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas de la API:', error);
    throw error;
  }
}

export async function saveTaskToRealAPI(task) {
  try {
    let response;
    
    if (task.id) {
      // Actualizar tarea existente
      response = await axios.put(`${API_URL}/${task.id}`, task);
    } else {
      // Crear nueva tarea
      response = await axios.post(API_URL, task);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al guardar tarea en la API:', error);
    throw error;
  }
}

export async function removeTaskFromRealAPI(taskId) {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar tarea de la API:', error);
    throw error;
  }
} 