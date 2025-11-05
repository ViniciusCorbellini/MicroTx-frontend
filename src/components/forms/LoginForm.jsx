// src/components/forms/LoginForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import InputField from '../common/InputField';
import Button from '../common/Button';

import { useAuth } from '../../context/AuthContext'; 
import authService from '../../services/authService';

import styles from '../../styles/forms.module.css';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });
    const [error, setError] = useState(''); // Para mostrar erros da API

    const { login } = useAuth(); // a função login do contexto
    const navigate = useNavigate(); // Para redirecionar após o login

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        setError(''); // Limpa erros anteriores

        try {
            //faz a chamada a API do backend
            const { user, token } = await authService.login(formData.email, formData.senha);

            login(user, token);

            // Redireciona para o Dashboard
            navigate('/'); //TODO: corrigir lógica pra voltar corretamente ao dashboard

        } catch (err) {
            // Se a API retornar um erro
            console.error("Erro no login:", err);
            setError('Email ou senha inválidos.'); // Mostra um erro genérico
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}

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
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange}
                />

                <div className="mt-4">
                    <Button type="submit">
                        Entrar
                    </Button>
                </div>

                <div className="text-center mt-3">
                    <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
                </div>
            </form>
        </div>
    );
}