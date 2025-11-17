// src/components/dashboard/Recommendations.jsx
import { useFetch } from '../../hooks/useFetch';
import userService from '../../services/userService';
import { ListGroup, Spinner, Alert } from 'react-bootstrap';
import Button from '../common/Button';

export default function Recommendations() {
  const { data: users, loading, error } = useFetch(userService.getRecommendations);

  // Estado de Carregamento
  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  // Estado de Erro
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Estado de Sucesso
  return (
    <div className="p-3 bg-light rounded shadow-sm">
      <h5>Recomendações</h5>
      <ListGroup variant="flush">
        {users && users.length > 0 ? (
          users.map(user => (
            <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{user.nome}</strong>
              </div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                style={{ width: 'auto' }} 
              >
                Seguir
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p>Nenhuma recomendação encontrada.</p>
        )}
      </ListGroup>
    </div>
  );
}