// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';

/**
 * Barra de Navegação Principal (Topo).
 *
 * @component
 * @description
 * Componente persistente exibido em todas as páginas.
 * Gerencia a navegação e a exibição do estado da sessão do usuário.
 *
 * Comportamento Condicional:
 * - **Visitante:** Exibe apenas a marca (MicroTx) e links públicos (implícito).
 * - **Logado:** Exibe links de acesso rápido (Dashboard), e um Dropdown de Usuário
 * contendo a foto de perfil, nome e opções de conta (Perfil, Logout).
 */
function NavBar() {
	const { isAuthenticated, logout, user } = useAuth();
	const navigate = useNavigate();

	/**
     * Executa o encerramento da sessão.
     * 1. Limpa os dados do contexto (via `logout()`).
     * 2. Redireciona o usuário forçadamente para a tela de login.
     */
	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	/**
     * Elemento customizado para o cabeçalho do Dropdown.
     * Renderiza a foto de perfil (com fallback) e o nome do usuário lado a lado.
     * Utiliza estilos inline para garantir o recorte circular perfeito da imagem.
     * @type {JSX.Element}
     */
	const userTitle = (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<img
				src={getImageUrl(user?.fotoPerfil)}
				alt="Foto de perfil"
				style={{
					width: '32px',
					height: '32px',
					borderRadius: '50%', // Deixa redonda
					objectFit: 'cover',  // Evita que a imagem fique esticada
					marginRight: '8px'   // Espaço entre a foto e o texto
				}}
			/>
			<span>Olá, {user?.nome || 'Usuário'}</span>
		</div>
	);

	return (
		<Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
			<Container>
				<Navbar.Brand as={Link} to="/">MicroTx</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">

					<Nav className="me-auto">
						{/* Só mostra o link do Dashboard se o usuário estiver logado */}
						{isAuthenticated && (
							<Nav.Link as={Link} to="/">Dashboard</Nav.Link>
						)}
					</Nav>

					<Nav>
						{isAuthenticated ? (
							// Menu para usuário LOGADO
							<NavDropdown title={userTitle} id="basic-nav-dropdown">
								<NavDropdown.Item as={Link} to="/profile">
									Perfil
								</NavDropdown.Item>
								
								<NavDropdown.Divider />
								
								<NavDropdown.Item onClick={handleLogout}>
									Sair
								</NavDropdown.Item>
							</NavDropdown>
						) : (
							// Links para usuário DESLOGADO
							<>
								<Nav.Link as={Link} to="/login">Login</Nav.Link>
								<Nav.Link as={Link} to="/register">Cadastrar</Nav.Link>
							</>
						)}
					</Nav>

				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default NavBar;