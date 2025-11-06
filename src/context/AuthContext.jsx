// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria um Contexto
const AuthContext = createContext(null);

// AuthProvider: É um componente que vai gerenciar o estado do user.
// Usamos o localStorage do navegador para manter o usuário logado mesmo que ele feche a aba.
// Criando o Provedor (Provider)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Efeito para verificar se já existe um usuário no localStorage ao carregar a app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Falha ao carregar usuário do localStorage:", error);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Função de login
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Criando um Hook customizado para usar o contexto
// useAuth: É um hook que nos dará acesso fácil a user, isAuthenticated, login e logout em qualquer componente.
export const useAuth = () => {
  return useContext(AuthContext);
};