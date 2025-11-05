// src/components/forms/RegisterForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import InputField from '../common/InputField';
import Button from '../common/Button';

import authService from '../../services/authService';

import styles from '../../styles/forms.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senhaHash: '',
    confirmarSenha: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError(''); // Limpa erros anteriores

    // Validação simples de senha
    if (formData.senhaHash !== formData.confirmarSenha) {
      setError('As senhas não conferem.');
      return;
    }

    try {
      const { nome, email, senhaHash } = formData;
      await authService.register({ nome, email, senhaHash });

      // Se o cadastro foi um sucesso, redireciona o usuário para o login
      alert('Cadastro realizado com sucesso! Faça seu login.');
      navigate('/login');

    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError(err.message || 'Erro ao tentar cadastrar. Tente outro email.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <InputField
          label="Nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
        />
        <InputField
          label="Senha"
          name="senhaHash"
          type="password"
          value={formData.senhaHash}
          onChange={handleChange}
        />
        <InputField
          label="Confirme a Senha"
          name="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={handleChange}
        />
        <div className="mt-4">
          <Button type="submit">
            Cadastrar
          </Button>
        </div>
        <div className="text-center mt-3">
          <p>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
        </div>
      </form>
    </div>
  );
}
