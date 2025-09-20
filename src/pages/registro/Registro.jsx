import React from 'react';
import RegistroForm from '../../components/registro/RegistroForm';
import './Registro.css';

const Registro = () => {
  //const navigate = useNavigate();

  const handleSuccess = () => {
    //navigate('/login');
  };

  return (
    <div className="registro-bg">
      <main className="registro-main">
        <RegistroForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
};

export default Registro;