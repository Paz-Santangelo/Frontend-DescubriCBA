import React from 'react';
import LoginForm from '../../components/login/LoginForm';
import './Login.css';

const Login = () => {
  //const navigate = useNavigate();

  const handleSuccess = () => {
    //navigate('/');
  };

  return (
    <div className="login-bg">
      <main className="login-main">
        <LoginForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
};

export default Login;