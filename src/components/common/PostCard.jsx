import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import { Dropdown } from 'react-bootstrap';

import { getImageUrl } from '../../utils/imageHelper';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente de cartão para exibição de uma publicação individual.
 *
 * @component
 * @description
 * Exibe o conteúdo do post, informações do autor e data.
 * Inclui lógica interna para verificar se o usuário logado é o dono do post (`isOwner`),
 * habilitando o menu de opções (Editar/Excluir) condicionalmente.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.post - Objeto contendo os dados do post (id, texto, dataCriacao, usuarioId, nomeUsuario, fotoPerfil).
 * @param {function(Object): void} props.onEdit - Callback disparado ao clicar em "Editar". Recebe o objeto do post.
 * @param {function(number): void} props.onDelete - Callback disparado ao clicar em "Excluir". Recebe o ID do post.
 *
 * @returns {JSX.Element} O card renderizado com Bootstrap.
 */
export default function PostCard({ post, onEdit, onDelete }) {
    const { user } = useAuth();

    const authorName = post.nomeUsuario || "Usuário Desconhecido";

    const avatarSrc = getImageUrl(post.fotoPerfil)

    const profileLink = post.usuarioId ? `/user/${post.usuarioId}` : '#';

    const isOwner = user && (post.usuarioId === user.id);

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

                    {/* Informações do post */}
                    <div>
                        <h6 className="m-0 small fw-bold">
                            {post.usuarioId ? (
                                // Link para a página de perfil do usuário
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

                    {/* Caso o usuário for o dono do post */}
                    {isOwner && (
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="text-muted p-0 border-0 no-caret">
                                <i className="bi bi-three-dots-vertical"></i> {/* Ícone de 3 pontos */}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => onEdit(post)}>Editar</Dropdown.Item>
                                <Dropdown.Item onClick={() => onDelete(post.id)} className="text-danger">Excluir</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                </div>

                {/* Texto do post */}
                <Card.Text>
                    {post.texto}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}