import { useState } from 'react';
import { config } from '../../services/config';
import './BackendStatus.css';

const BackendStatus = () => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="backend-status-toggle">
        <button 
          onClick={() => setIsVisible(true)}
          className="toggle-btn"
        >
          ℹ️ Info Backend
        </button>
      </div>
    );
  }

  return (
    <div className="backend-status-panel">
      <div className="status-header">
        <h4>🌐 Estado del Backend</h4>
        <button 
          onClick={() => setIsVisible(false)}
          className="close-btn"
        >
          ✕
        </button>
      </div>
      
      <div className="status-content">
        <div className="status-item">
          <strong>Modo:</strong>
          <span className="status-real">🌐 Backend Real</span>
        </div>
        
        <div className="status-item">
          <strong>URL Backend:</strong>
          <span>{config.BACKEND_URL}</span>
        </div>
        
        <div className="status-item">
          <strong>Timeout:</strong>
          <span>{config.REQUEST_TIMEOUT}ms</span>
        </div>
      </div>
    </div>
  );
};

export default BackendStatus;