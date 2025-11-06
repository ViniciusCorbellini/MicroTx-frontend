// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              <NavDropdown title={`Olá, ${user?.nome || 'Usuário'}`} id="basic-nav-dropdown">
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