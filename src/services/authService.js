import api from "../api/api";

const authService = {
    /**
     * Realiza a autenticação do usuário enviando as credenciais ao backend.
     * * @param {string} email - O endereço de e-mail do usuário.
     * @param {string} senha - A senha de acesso (plain text).
     * @returns {Promise<Object>} Promessa que resolve com os dados de resposta (ex: token, user info).
     * @throws {Object|Error} Lança o erro vindo da API ou um erro genérico caso a requisição falhe.
     */
    login: async (email, senha) => {
        try {
            const response = await api.post('/auth/login', { email, senha });
            return response.data;
        } catch (error) {
            throw error.response?.data || new Error('Erro ao tentar fazer login');
        }
    },

    /**
     * Envia os dados cadastrais para registrar um novo usuário.
     * * @param {Object} formData - Objeto contendo os campos do formulário (nome, email, senha, etc.).
     * @returns {Promise<Object>} Promessa com os dados do usuário criado/confirmação.
     * @throws {Object|Error} Lança erro caso o cadastro falhe (ex: email duplicado).
     */
    register: async (formData) => {
        try {
            const response = await api.post('/auth/register', formData);
            return response.data
        } catch (error) {
            console.log(error)
            throw error.response?.data || new Error('Erro ao tentar fazer cadastro');
        }
    },

    /**
     * Verifica a validade do token JWT armazenado no LocalStorage.
     * * @description
     * 1. Verifica se há token localmente.
     * 2. Consulta o backend para validar o token.
     * 3. Captura erros 401/403 e retorna false (não logado) em vez de lançar exceção.
     * * @returns {Promise<boolean>} Retorna `true` se o token for válido (status 200), ou `false` se inválido/inexistente.
     * @throws {Object|Error} Lança erro apenas para falhas de servidor ou rede (diferentes de 401/403).
     */
    validate: async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log("AuthService: Sem token no storage, validação cancelada.");
                return false;
            }
            const response = await api.get('/auth/validate');
            return response.status === 200;
        } catch (error) {
            console.log(error);
            // Se o erro for 403 ou 401, o token é inválido
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log("AuthService: Validação falhou (token inválido ou expirado).");
                return false; // Retorna false em vez de lançar um erro
            }
            throw error.response?.data || new Error('Erro ao validar token jwt');
        }
    },
}

export default authService;