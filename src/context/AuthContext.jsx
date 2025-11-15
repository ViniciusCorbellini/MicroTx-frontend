// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Cria um Contexto
const AuthContext = createContext(null);

// AuthProvider: É um componente que vai gerenciar o estado do user.
// Usamos o localStorage do navegador para manter o usuário logado mesmo que ele feche a aba.
// Criando o Provedor (Provider)
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Essa função roda apenas uma vez, quando o provider é montado
	useEffect(() => {
		const loadUserFromStorage = async () => {
			try {
				const userJSON = localStorage.getItem('user');
				const token = localStorage.getItem('token');

				if (!userJSON || !token) {
					console.log("AuthContext: Sem usuário ou token no storage. Nada a fazer.");
					return;
				}

				console.log("AuthContext: Encontrou user e token. Validando...");

				const isValid = await authService.validate();

				console.log("AuthContext: Resultado da validação:", isValid);

				if (isValid) {
					setUser(JSON.parse(userJSON));
					setIsAuthenticated(true);
					console.log("AuthContext: Usuário validado e carregado com sucesso.");
				} else {
					// Se 'validate' retornar 'false' (token expirado/inválido), limpa-se o storage
					console.log("AuthContext: Validação falhou (token inválido). Limpando storage.");
					localStorage.clear();
					setIsAuthenticated(false);
					setUser(null);
				}

			} catch (error) {
				console.error('AuthContext: Falha crítica ao carregar usuário', error);
				localStorage.clear();
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadUserFromStorage();
	}, []); // O array vazio [] garante que isso rode só na montagem

	// Função de login
	const login = (data) => {
		const userToStore = {
			id: data.id,
			nome: data.nome,
			email: data.email
		};

		localStorage.setItem('user', JSON.stringify(userToStore));
		localStorage.setItem('token', data.token);

		setUser(userToStore);
		setIsAuthenticated(true);
	};

	// Função de logout
	const logout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		setUser(null);
		setIsAuthenticated(false);
	};

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth: É um hook que nos dará acesso fácil a user, isAuthenticated, login e logout em qualquer componente.
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};