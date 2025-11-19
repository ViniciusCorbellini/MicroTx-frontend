import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <p>Carregando...</p>;

  console.log(user.foto)

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          
          {/* Card do Perfil estilo Protótipo */}
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#fdfdf5' }}> {/* Cor do fundo do seu desenho */}
            <div className="card-body text-center p-5">
              
              {/* Círculo da Foto (O "pfp" do desenho) */}
              <div className="mb-4 position-relative d-inline-block">
                <img 
                  src={getImageUrl(user.fotoPerfil)} 
                  alt="Foto de Perfil" 
                  className="rounded-circle border border-3 border-white shadow-sm"
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    objectFit: 'cover',
                    backgroundColor: '#eee'
                  }} 
                />
              </div>

              {/* Info Cadastrais (O quadrado grande do desenho) */}
              <div className="bg-white p-4 rounded-3 shadow-sm mb-4 text-start">
                <h5 className="mb-3 text-secondary border-bottom pb-2">Info Cadastrais</h5>
                
                <div className="mb-3">
                  <label className="small text-muted fw-bold">NOME</label>
                  <p className="m-0 lead">{user.nome}</p>
                </div>

                <div className="mb-3">
                  <label className="small text-muted fw-bold">EMAIL</label>
                  <p className="m-0">{user.email}</p>
                </div>
                
                {/* Se tiver mais campos no futuro (Bio, Data Nasc), coloque aqui */}
              </div>

              {/* Botões do Rodapé (Alterar e Sair) */}
              <div className="d-flex justify-content-between gap-3">
                <Button variant="outline-secondary" onClick={() => alert('Editar perfil em breve!')}>
                  Alterar
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Sair
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}