import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Certifique-se de ter este import
import { getImageUrl } from '../../utils/imageHelper';

export default function PostCard({ post }) {
    const authorName = post.nomeUsuario || "Usuário Desconhecido";
    
    const avatarSrc = getImageUrl(post.fotoPerfil)

    const profileLink = post.usuarioId ? `/user/${post.usuarioId}` : '#';

    return (
        <Card className="mb-3 shadow-sm border-0">
            <Card.Body>
                <div className="d-flex align-items-center mb-2">

                    {/* Avatar */}
                    <Image
                        src={avatarSrc}
                        roundedCircle
                        width={32}
                        height={32}
                        className="me-2 bg-secondary" // bg-secondary ajuda se a imagem demorar a carregar
                        style={{ objectFit: 'cover' }}
                        alt={authorName}
                    />

                    <div>
                        <h6 className="m-0 small fw-bold">
                            {post.usuarioId ? (
                                <Link to={profileLink} className="text-decoration-none text-dark">
                                    {authorName}
                                </Link>
                            ) : (
                                <span className="text-muted">{authorName}</span>
                            )}
                        </h6>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {new Date(post.dataCriacao).toLocaleDateString()}
                        </small>
                    </div>
                </div>

                <Card.Text>
                    {post.texto}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}