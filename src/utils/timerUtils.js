/**
 * Utilidades para el manejo de temporizadores
 * Demuestra conocimientos de JavaScript ES6+
 */

/**
 * Formatea segundos en formato MM:SS
 * @param {number} seconds - Segundos a formatear
 * @returns {string} - Tiempo formateado
 */
export const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Convierte minutos a segundos
 * @param {number} minutes - Minutos a convertir
 * @returns {number} - Segundos
 */
export const minutesToSeconds = (minutes) => {
  return minutes * 60;
};

/**
 * Convierte segundos a minutos
 * @param {number} seconds - Segundos a convertir
 * @returns {number} - Minutos (con decimales)
 */
export const secondsToMinutes = (seconds) => {
  return seconds / 60;
};

/**
 * Calcula el porcentaje de progreso
 * @param {number} current - Valor actual
 * @param {number} total - Valor total
 * @returns {number} - Porcentaje de progreso (0-100)
 */
export const calculateProgress = (current, total) => {
  if (total === 0) return 0;
  return ((total - current) / total) * 100;
};

/**
 * Crea un temporizador que ejecuta una función cada segundo
 * Demuestra el uso de closures y manejo de eventos
 * 
 * @param {Function} onTick - Función a ejecutar en cada tick
 * @param {Function} onComplete - Función a ejecutar al completar
 * @returns {Object} - Objeto con métodos para controlar el temporizador
 */
export const createTimer = (onTick, onComplete) => {
  let interval = null;
  let remaining = 0;
  let duration = 0;
  let isActive = false;
  
  // Iniciar el temporizador
  const start = (seconds) => {
    if (isActive) return;
    
    duration = seconds;
    remaining = seconds;
    isActive = true;
    
    // Usar setInterval para actualizar cada segundo
    interval = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        onTick && onTick(remaining);
      } else {
        stop();
        onComplete && onComplete();
      }
    }, 1000);
    
    return remaining;
  };
  
  // Pausar el temporizador
  const pause = () => {
    if (!isActive) return;
    
    clearInterval(interval);
    isActive = false;
    
    return remaining;
  };
  
  // Detener el temporizador
  const stop = () => {
    clearInterval(interval);
    isActive = false;
    
    return remaining;
  };
  
  // Reiniciar el temporizador
  const reset = () => {
    stop();
    remaining = duration;
    
    return remaining;
  };
  
  // Obtener tiempo restante
  const getRemaining = () => remaining;
  
  // Verificar si está activo
  const getIsActive = () => isActive;
  
  // Retornar API pública del temporizador
  return {
    start,
    pause,
    stop,
    reset,
    getRemaining,
    getIsActive
  };
};

/**
 * Reproduce un sonido de notificación
 * @param {string} soundUrl - URL del sonido a reproducir
 * @returns {Promise} - Promesa que se resuelve cuando el sonido termina
 */
export const playNotificationSound = (soundUrl = 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3') => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(soundUrl);
      
      audio.addEventListener('ended', () => {
        resolve();
      });
      
      audio.addEventListener('error', (err) => {
        reject(err);
      });
      
      audio.play();
    } catch (error) {
      reject(error);
    }
  });
}; 