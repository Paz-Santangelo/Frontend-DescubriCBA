import { useNavigate } from 'react-router-dom';
import RegistroForm from '../../components/registro/RegistroForm';
import './registro.css';

const Registro = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // Redirigir al login después del registro exitoso
    navigate('/login');
  };

  return (
    <div className="registro-bg">
      <main className="registro-main d-flex justify-content-center align-items-center">
        <RegistroForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
};

export default Registro;