import { Alert } from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';
import './Notification.css';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <Alert
          key={n.id}
          variant={n.variant}
          onClose={() => removeNotification(n.id)}
          dismissible
          className="notification-toast"
        >
          {n.message}
        </Alert>
      ))}
    </div>
  );
};

export default NotificationContainer;
