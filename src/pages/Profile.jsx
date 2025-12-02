import { useState } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageHelper';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/profile/EditProfileModal';
import CreatePostForm from '../components/forms/CreatePostForm';
import PostCard from '../components/common/PostCard';
import EditPostModal from '../components/profile/EditPostModal';
import postService from '../services/postService';
import userService from '../services/userService';

/**
 * Tela de Perfil do Usuário.
 *
 * @description
 * Centraliza o gerenciamento da conta e conteúdo do usuário. Permite:
 * 1. Visualizar dados cadastrais.
 * 2. Editar perfil ou Excluir a conta permanentemente.
 * 3. Gerenciar publicações (Criar, Listar, Editar, Deletar).
 */
export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // states pra posts
    const [myPosts, setMyPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // states pra edição de posts
    const [editingPost, setEditingPost] = useState(null);
    const [showEditPostModal, setShowEditPostModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /**
     * Exclui a conta do usuário permanentemente.
     *
     * @description
     * 1. Solicita confirmação via `window.confirm`.
     * 2. Chama o serviço para deletar o usuário no backend.
     * 3. Força o logout e redireciona via `window.location.href` (hard reload).
     *
     * @note O uso de `window.location.href` em vez de `Maps` é intencional
     * para garantir que o estado da aplicação seja limpo completamente e evitar
     * conflitos com rotas protegidas durante o redirecionamento.
     */
    const handleDelete = async () => {
        // Confirmação de Segurança
        const confirm = window.confirm("Tem certeza absoluta? Esta ação apagará sua conta e todos os seus posts permanentemente.");

        if (confirm) {
            try {

                await userService.deleteUser();

                logout();

                // Mostra uma mensagem no navegador e redireciona para o cadastro
                alert("Sua conta foi excluída.");
                
                // força o redirecionamento para o cadastro
                // Isso impede que o ProtectedRoute interfira mandando para o login
                window.location.href = '/register';

            } catch (error) {
                console.error("Erro ao deletar usuário", error);
                alert("Ocorreu um erro ao tentar excluir a conta.");
            }
        }
    };

    // use effect pra carregar os posts ao entrar
    useEffect(() => {
        if (user) {
            loadMyPosts();
        }
    }, [user]);

    /**
     * Carrega a lista de posts do usuário logado.
     *
     * @description
     * Busca os posts paginados e injeta manualmente as informações do usuário atual
     * (nome, foto, id) em cada objeto de post. Isso é necessário para que o
     * componente `PostCard` renderize o cabeçalho corretamente e habilite
     * os botões de edição/exclusão (isOwner).
     */
    const loadMyPosts = async () => {
        try {
            setLoadingPosts(true);
            const data = await postService.getUserPostsPaginated(user.id, 0, 20);
            const content = data.content || [];

            // Injetando as infos do usuário logado em cada post
            const postsWithUserData = content.map(post => ({
                ...post,

                // Injeta os dados que faltam para o PostCard funcionar
                nomeUsuario: user.nome,
                fotoPerfil: user.fotoPerfil,
                usuarioId: user.id // Garante que o isOwner funcione
            }));

            setMyPosts(postsWithUserData);
        } catch (error) {
            console.error("Erro ao carregar posts", error);
        } finally {
            setLoadingPosts(false);
        }
    };

    /**
     * Callback executado após a criação de um novo post com sucesso.
     *
     * @param {Object} newPost - O objeto do post retornado pelo backend.
     * @description
     * Adiciona o novo post ao topo da lista local (`myPosts`).
     * Assim como no carregamento, injeta os dados do usuário logado no objeto
     * para exibição imediata sem necessidade de nova requisição (refresh).
     */
    const handlePostCreated = (newPost) => {
        // O post criado não vem com os dados do usuário populados (nome, foto), 
        // então injetamos manualmente para exibir na hora sem recarregar tudo
        const postWithUser = {
            ...newPost,
            nomeUsuario: user.nome,
            usuarioId: user.id,
            fotoPerfil: user.fotoPerfil
        };
        setMyPosts([postWithUser, ...myPosts]);
    };

    // Preparar para editar
    const handleEditClick = (post) => {
        setEditingPost(post);
        setShowEditPostModal(true);
    };

    /**
     * Atualiza um post específico na lista após edição.
     * Substitui o objeto antigo pelo atualizado mantendo a ordem da lista.
     * @param {Object} updatedPost - O objeto do post já modificado.
     */
    const handlePostUpdated = (updatedPost) => {
        setMyPosts(prevPosts =>
            prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
        );
    };

    /**
     * Remove um post da lista visual após exclusão confirmada na API.
     * @param {number} postId - ID do post a ser removido.
     */
    const handleDeleteClick = async (postId) => {
        if (window.confirm("Tem certeza que deseja excluir este post?")) {
            try {
                await postService.deletePost(postId);
                // Remove da lista visualmente
                setMyPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
            } catch (error) {
                alert("Erro ao excluir.");
            }
        }
    };

    if (!user) return <p>Carregando...</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">

                    {/* Card do Perfil estilo Protótipo */}
                    <div className="card shadow-sm border-0" style={{ borderRadius: '15px', backgroundColor: '#fdfdf5' }}> {/* Cor do fundo do seu desenho */}
                        <div className="card-body text-center p-5 mb-6">

                            {/* Pfp */}
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

                            {/* Info Cadastrais */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4 text-start">
                                <h5 className="mb-3 text-secondary border-bottom pb-2">Informações Cadastrais</h5>

                                <div className="mb-3">
                                    <label className="small text-muted fw-bold">NOME</label>
                                    <p className="m-0 lead">{user.nome}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="small text-muted fw-bold">EMAIL</label>
                                    <p className="m-0">{user.email}</p>
                                </div>
                            </div>

                            {/* Botões do Footer (Alterar, sair e deletar) */}
                            <div className="d-flex justify-content-between gap-3">
                                <Button variant="outline-secondary" onClick={() => setShowModal(true)}>
                                    Alterar
                                </Button>
                                <Button variant="outline-danger" onClick={handleLogout}>
                                    Sair
                                </Button>
                                <Button variant="outline-danger" onClick={handleDelete}>
                                    Deletar perfil
                                </Button>
                            </div>

                        </div>
                    </div>

                    {/* Criação de post */}
                    <CreatePostForm onPostCreated={handlePostCreated} />

                    {/* Lista de posts do usuário */}
                    <h5 className="mb-3 text-secondary">Minhas Publicações</h5>

                    {loadingPosts ? (
                        <div className="text-center"><div className="spinner-border text-secondary"></div></div>
                    ) : (
                        myPosts.length > 0 ? (
                            myPosts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            ))
                        ) : (
                            <p className="text-center text-muted">Você ainda não publicou nada.</p>
                        )
                    )}
                </div>
            </div>

            <EditProfileModal show={showModal} onHide={() => setShowModal(false)} />

            <EditPostModal
                show={showEditPostModal}
                onHide={() => setShowEditPostModal(false)}
                post={editingPost}
                onUpdate={handlePostUpdated}
            />
        </div>
    );
}