import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Container, Row, Col, Image, Card } from 'react-bootstrap';

import userService from '../services/userService';
import { getImageUrl } from '../utils/imageHelper';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
    const { id } = useParams(); // Pega o ID da URL (ex: /user/12 -> id = 12)
    const { user: currentUser } = useAuth(); // Usuário logado (para não seguir a si mesmo)

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Carrega tudo ao entrar na página
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Executa as 3 requisições em paralelo para ser mais rápido
                const [userResponse, postsResponse, followingResponse] = await Promise.all([
                    userService.getUserById(id),
                    userService.getUserPosts(id),
                    userService.isFollowing(id)
                ]);

                setProfile(userResponse);
                setPosts(postsResponse);
                setIsFollowing(followingResponse);
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    // Lógica de Seguir/Unfollow (reaproveitada)
    const handleToggleFollow = async () => {
        try {
            if (isFollowing) {
                await userService.unfollowUser(id);
            } else {
                await userService.followUser(id);
            }
            setIsFollowing(!isFollowing); // Inverte o estado visualmente
        } catch (error) {
            console.error("Erro ao seguir/deixar de seguir", error);
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (!profile) return <p className="text-center mt-5">Usuário não encontrado.</p>;

    const isMe = currentUser?.id === Number(id); // Verifica se é o próprio usuário

    return (
        <Container className="mt-4">
            {/* header do profile */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                        {/* Foto */}
                        <div className="me-4">
                            <Image
                                src={getImageUrl(profile.fotoPerfil)}
                                roundedCircle
                                width={100}
                                height={100}
                                style={{ objectFit: 'cover' }}
                                className="border border-3 border-white shadow-sm"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-grow-1">
                            <h3 className="fw-bold mb-1">{profile.nome}</h3>
                            <p className="text-muted mb-2">{profile.email}</p> {/* Ou Bio se tiver */}

                            <div className="d-flex gap-3 text-muted small">
                                <span><strong>{posts.length}</strong> posts</span>
                                <span><strong>{profile.seguidores}</strong> seguidores</span>
                                <span><strong>{profile.seguindo}</strong> seguindo</span>
                            </div>
                        </div>

                        {/* Botão de Ação */}
                        <div>
                            {!isMe && (
                                <Button
                                    variant={isFollowing ? "outline-secondary" : "primary"}
                                    onClick={handleToggleFollow}
                                    className="px-4 rounded-pill"
                                >
                                    {isFollowing ? 'Seguindo' : 'Seguir'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Posts */}
            <h5 className="mb-3 fw-bold text-secondary">Publicações</h5>
            <Row>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Col md={4} key={post.id} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 overflow-hidden">
                                <Card.Body>
                                    <Card.Text className="small text-muted">
                                        {/* Texto do post */}
                                        {post.texto || "Sem legenda"}
                                    </Card.Text>
                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                        {/* Data do post */}
                                        {new Date(post.dataCriacao).toLocaleDateString()}
                                    </small>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <div className="p-5 text-center bg-light rounded-3 text-muted">
                            Este usuário ainda não tem publicações.
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
}