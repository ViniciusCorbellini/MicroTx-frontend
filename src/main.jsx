// src/main.jsx

//Api
import api from './api/api.js';
import './api/interceptorConfig.js'

// React
import React from 'react';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Estilização - bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js"

//Estilização - bootstrap
import './styles/global.css';

//Paginas
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

//Layout e seguranca
import AppLayout from './AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Contexto
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // O Layout agora é o elemento PAI de quase tudo
    children: [
      // Rotas Protegidas
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // Rotas Públicas que compartilham o mesmo layout
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
  // Você pode adicionar aqui rotas que REALMENTE não devem ter layout nenhum,
  // como uma página 404 personalizada, por exemplo.
  // { path: '*', element: <NotFoundPage /> }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);