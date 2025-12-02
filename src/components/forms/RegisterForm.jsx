// src/components/forms/RegisterForm.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import InputField from '../common/InputField';
import Button from '../common/Button';

import authService from '../../services/authService';

import styles from '../../styles/forms.module.css';

/**
 * Formulário de Cadastro de Usuário.
 *
 * @component
 * @description
 * Gerencia o registro de novos usuários, incluindo upload de foto de perfil.
 *
 * Diferente do login (que envia JSON simples), este formulário constrói um objeto
 * `FormData` para suportar o envio multipart/form-data (texto + arquivo).
 *
 * Principais funcionalidades:
 * 1. Validação local de confirmação de senha.
 * 2. Preview de arquivo (lógica de seleção).
 * 3. Envio estruturado: 'user' como JSON string e 'foto' como binário.
 */
export default function RegisterForm() {
	const [formData, setFormData] = useState({
		nome: '',
		email: '',
		senhaHash: '',
		confirmarSenha: '',
	});

	const [error, setError] = useState('');
	const [foto, setFoto] = useState(null);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setFoto(e.target.files[0]);
		}
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
			/**
			 * Estrutura do envio:
			 * - 'user': Blob/String JSON contendo { nome, email, senhaHash }
			 * - 'foto': Arquivo binário (File Object)
			 * Isso permite que o Spring Boot receba ambos @RequestPart corretamente.
			 */
			const sendData = new FormData();

			const userDto = {
				nome: formData.nome,
				email: formData.email,
				senhaHash: formData.senhaHash
			};

			sendData.append('user', new Blob([JSON.stringify(userDto)], {
				type: 'application/json'
			}));

			if (foto) {
				sendData.append('foto', foto);
			}

			await authService.register(sendData);

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
				<div className="mb-3">
					<label className="form-label">Foto de Perfil (Opcional)</label>
					<input
						type="file"
						className="form-control"
						accept="image/*"
						onChange={handleFileChange}
					/>
				</div>
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
