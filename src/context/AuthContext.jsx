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
					return;
				}

				const isValid = await authService.validate();

				if (isValid) {
					setUser(JSON.parse(userJSON));
					setIsAuthenticated(true);
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

	/**
     * Efetua o login no contexto, salvando token e usuário no LocalStorage.
     * @param {Object} data - Resposta da API contendo token e dados do usuário.
     */
	const login = (data) => {
		const userToStore = {
			id: data.id,
			nome: data.nome,
			fotoPerfil: data.fotoPerfil,
			email: data.email
		};

		localStorage.setItem('user', JSON.stringify(userToStore));
		localStorage.setItem('token', data.token);

		setUser(userToStore);
		setIsAuthenticated(true);
	};

	/**
     * Atualiza parcialmente os dados do usuário logado (ex: trocar foto ou nome).
     * Mantém o ID e Token inalterados.
     * @param {Partial<User>} newUserData - Objeto com os campos a serem atualizados.
     */
	const updateUser = (newUserData) => {
		// Recupera o usuário atual COMPLETO que já está salvo (com ID e Token)
		const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

		// Mescla um novo objeto com as propriedades do antigo
		// O 'newUserData' vai sobrescrever apenas nome, email e foto. O ID será mantido.
		const mergedUser = { ...currentUser, ...newUserData };

		// Atualiza o Estado do user
		setUser(mergedUser);

		// Atualiza o LocalStorage com o objeto novo
		localStorage.setItem('user', JSON.stringify(mergedUser));
	};

	/**
     * remove as informações do localstorage e atualiza o contexto
     */
	const logout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		setUser(null);
		setIsAuthenticated(false);
	};

	// Valor de retorno do hook
	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
		updateUser
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para acessar o contexto de autenticação.
 * Garante que o hook seja usado apenas dentro de um AuthProvider.
 *
 * @returns {AuthContext} O valor do contexto (user, login, logout, etc).
 * @throws {Error} Se for usado fora do escopo do AuthProvider.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};