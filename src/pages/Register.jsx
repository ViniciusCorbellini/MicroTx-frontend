// src/pages/Register.jsx
import RegisterForm from '../components/forms/RegisterForm';

export default function Register() {
  return (
    <div className="form-container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center mb-4">Cadastro</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
