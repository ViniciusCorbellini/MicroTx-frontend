import { useFetch } from '../../hooks/useFetch';
import userService from '../../services/userService';
import { ListGroup, Spinner, Alert, Image } from 'react-bootstrap'; // Adicione Image
import Button from '../common/Button';
import { getImageUrl } from '../../utils/imageHelper'; // Importe o helper

export default function Recommendations() {
  const { data: users, loading, error } = useFetch(userService.getUserRecommendations);

  if (loading) return <div className="text-center"><Spinner animation="border" size="sm" /></div>;
  if (error) return <Alert variant="danger" className="p-2"><small>{error}</small></Alert>;

  return (
    <div className="p-3 bg-light rounded shadow-sm">
      <h6 className="mb-3">Seguindo/Recomendados</h6> {/* Ajustei para h6 pra ficar mais delicado */}
      <ListGroup variant="flush" className="bg-transparent">
        {users && users.length > 0 ? (
          users.map(user => (
            <ListGroup.Item key={user.id} className="d-flex align-items-center bg-transparent px-0 py-2 border-0">
              
              {/* Imagem do Perfil */}
              <div className="me-2">
                <Image 
                  src={getImageUrl(user.fotoPerfil)} 
                  roundedCircle 
                  width={40} 
                  height={40}
                  style={{ objectFit: 'cover' }} // Garante que a foto não distorça
                  alt={user.nome} 
                />
              </div>

              <div className="flex-grow-1 overflow-hidden">
                <div className="text-truncate fw-bold" style={{ fontSize: '0.9rem' }}>
                  {user.nome}
                </div>
              </div>

              <Button 
                variant="outline-primary" 
                size="sm" 
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
              >
                Seguir
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p className="text-muted small">Nenhuma recomendação.</p>
        )}
      </ListGroup>
    </div>
  );
}