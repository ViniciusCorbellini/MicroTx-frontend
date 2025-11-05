// src/pages/Login.jsx
import LoginForm from '../components/forms/LoginForm';

export default function Login() {
  return (
    <div className="form-container"> {/* Reutilizamos o mesmo estilo! */}
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center mb-4">Login</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}