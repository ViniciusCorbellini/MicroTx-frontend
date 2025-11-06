// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria um Contexto
const AuthContext = createContext(null);

// AuthProvider: É um componente que vai gerenciar o estado do user.
// Usamos o localStorage do navegador para manter o usuário logado mesmo que ele feche a aba.
// Criando o Provedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para verificar se já existe um usuário no localStorage ao carregar a app
  useEffect(() => {
    // Essa função roda apenas uma vez, quando o provider é montado
    const loadUserFromStorage = () => {
      try {
        const userJSON = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userJSON && token) {
          setUser(JSON.parse(userJSON));
          setIsAuthenticated(true);
          // TODO: validar token aqui
        }
      } catch (error) {
        console.error('Falha ao carregar usuário do storage', error);
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
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
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