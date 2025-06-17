import { createApp } from 'vue';
import App from './App.vue';
import './styles/main.scss';
import { auth, db } from './services/firebaseConfig';

// Exportar auth y db para que estén disponibles en toda la aplicación
export { auth, db };

// Demostración de uso de JavaScript ES6+
// - Uso de imports/exports (módulos ES6)
// - Arrow functions
// - Promises y async/await en componentes

// Crear y montar la aplicación Vue
const app = createApp(App);

// Registrar un componente web personalizado (Web Component)
// Esto demuestra conocimiento de Web Components nativos
class FocusButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    const button = document.createElement('button');
    button.textContent = this.getAttribute('label') || 'Enfocar';
    button.addEventListener('click', () => {
      // Dispatch custom event that Vue components can listen for
      this.dispatchEvent(new CustomEvent('focus-clicked', {
        bubbles: true,
        composed: true
      }));
    });
    
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }
      
      button {
        background-color: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 9999px;
        color: #2c3e50;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
      }
      
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0)
        );
        border-radius: 9999px 9999px 0 0;
      }
      
      button:hover {
        background-color: rgba(255, 255, 255, 0.7);
        transform: translateY(-2px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      }
      
      button:active {
        transform: translateY(0);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      }
      
      @keyframes shimmer {
        0% {
          background-position: -100% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      button::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0)
        );
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
        z-index: 1;
        pointer-events: none;
      }
    `;
    
    shadow.appendChild(style);
    shadow.appendChild(button);
  }
}

// Registrar el componente web personalizado
customElements.define('focus-button', FocusButton);

// Montar la aplicación
app.mount('#app'); 