import { useFetch } from '../../hooks/useFetch';
import userService from '../../services/userService';
import Button from '../common/Button';
import { getImageUrl } from '../../utils/imageHelper';

import { ListGroup, Spinner, Alert, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_AVATAR = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

export default function Recommendations() {
    const { data: initialData, loading, error } = useFetch(userService.getUserRecommendations);
    const [usersList, setUsersList] = useState([]); // fazendo um useState pra armazenar os users pra permitir o seguir/deixar de "

    useEffect(() => {
        const fetchStatuses = async () => {
            if (initialData && initialData.length > 0) {

                // Primeira render def 'seguindo: false'
                // evita que a lista fique branca enquanto ocorre a verificação dos status
                const initialList = initialData.map(u => ({ ...u, seguindo: false }));
                setUsersList(initialList);

                //  Prepara todas as requisições de verificação em paralelo
                const statusPromises = initialData.map(async (user) => {
                    const isFollowing = await userService.isFollowing(user.id);
                    return { id: user.id, status: isFollowing };
                });

                // Aguarda as respostas 
                const results = await Promise.all(statusPromises);

                // Atualiza a lista com os status reais de follow
                setUsersList(prevList =>
                    prevList.map(user => {
                        // Encontra o resultado correspondente a este usuário
                        const result = results.find(r => r.id === user.id);
                        return {
                            ...user,
                            seguindo: result ? result.status : false
                        };
                    })
                );
            }
        };

        fetchStatuses();
    }, [initialData]);

    const handleToggleFollow = async (userId) => {
        // Encontrando o user na lista atual para saber o seu status
        const targetUser = usersList.find(user => user.id === userId);

        if (!targetUser) return;

        try {
            if (targetUser.seguindo) {
                // deixar de seguir
                await userService.unfollowUser(userId);
            } else {
                // seguir
                await userService.followUser(userId);
            }

            // alterando o estado visual
            setUsersList(prevList =>
                prevList.map(user => {
                    if (user.id === userId) {
                        // Toggle
                        return { ...user, seguindo: !user.seguindo };
                    }
                    return user;
                })
            );

        } catch (err) {
            console.error("Erro ao alterar status de seguidor:", err);
        }
    };

    if (loading) return <div className="text-center"><Spinner animation="border" size="sm" /></div>;
    if (error) return <Alert variant="danger" className="p-2"><small>{error}</small></Alert>;

    return (
        <div className="p-3 bg-light rounded shadow-sm">
            <h6 className="mb-3 fw-bold text-secondary">Sugestões para você</h6>

            <ListGroup variant="flush" className="bg-transparent">
                {usersList && usersList.length > 0 ? (
                    usersList.map(user => (
                        <ListGroup.Item
                            key={user.id}
                            className="d-flex align-items-center px-0 py-2 border-0 bg-transparent"
                        >

                            {/* Avatar (Imagem ou Genérico) */}
                            <div className="me-2">
                                <Link to={`/user/${user.id}`}> {/* Link na foto */}
                                    <Image
                                        src={user.fotoPerfil ? getImageUrl(user.fotoPerfil) : DEFAULT_AVATAR}
                                        roundedCircle
                                        width={40}
                                        height={40}
                                        style={{ objectFit: 'cover' }}
                                        alt={user.nome}
                                    />
                                </Link>
                            </div>

                            {/* Nome */}
                            <div className="flex-grow-1 overflow-hidden me-2">
                                <Link to={`/user/${user.id}`}
                                    className="text-decoration-none text-dark"
                                > {/* Link no nome */}
                                    <div className="text-truncate fw-bold" style={{ fontSize: '0.9rem' }} title={user.nome}>
                                        {user.nome}
                                    </div>
                                </Link>
                            </div>

                            {/* Botão de Toggle */}
                            <Button
                                // Muda a cor conforme a relação de follow
                                variant={user.seguindo ? "outline-secondary" : "primary"}
                                size="sm"
                                className="rounded-pill px-3"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => handleToggleFollow(user.id)}
                            >
                                {user.seguindo ? 'Seguindo' : 'Seguir'}
                            </Button>

                        </ListGroup.Item>
                    ))
                ) : (
                    <p className="text-muted small">Nenhuma recomendação no momento.</p>
                )}
            </ListGroup>
        </div>
    );
}