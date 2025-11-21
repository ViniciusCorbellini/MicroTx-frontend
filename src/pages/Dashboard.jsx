import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, ListGroup, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

// Componentes
import Recommendations from '../components/dashboard/Recommendations';
import AnonymousQuotes from '../components/dashboard/AnonymousQuotes';
import SearchBar from '../components/forms/SearchBar';
import PostCard from '../components/common/PostCard';

// Serviços e Hooks
import postService from '../services/postService';
import userService from '../services/userService';

const DEFAULT_AVATAR = "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";

export default function Dashboard() {
	// Estados da Busca
	const [searchQuery, setSearchQuery] = useState('');
	const [searchType, setSearchType] = useState('posts');

	// Estados de Dados
	const [posts, setPosts] = useState([]); // Feed ou Resultado da busca
	const [userResults, setUserResults] = useState([]); // Resultado busca usuários
	const [loading, setLoading] = useState(false);

	// Carrega o Feed Inicial ao montar
	useEffect(() => {
		loadFeed();
	}, []);

	const loadFeed = async () => {
		setLoading(true);
		try {
			// Pega a página 0 do feed
			const data = await postService.getFeed(0, 10);
			setPosts(data.content); // O feed paginado retorna { content: [...] }
		} catch (error) {
			console.error("Erro ao carregar feed", error);
		} finally {
			setLoading(false);
		}
	};

	// Função chamada pela SearchBar
	const handleSearch = async (query, type) => {
		setSearchQuery(query);
		setSearchType(type);
		setLoading(true);

		try {
			if (!query.trim()) {
				// Se busca vazia, recarrega o feed padrão
				await loadFeed();
				setLoading(false);
				return;
			}

			if (type === 'posts') {
				const results = await postService.searchPosts(query);
				setPosts(results); // A busca retorna array direto [...]
			} else {
				const results = await userService.searchUsers(query);
				setUserResults(results); // A busca de user retorna array [...]
			}

		} catch (error) {
			console.error("Erro na busca", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container fluid className="py-4" data-bs-theme="light">
			<Row>
				{/* Coluna da Esquerda: Recomendações */}
				<Col md={3} className="d-none d-md-block">
					<Recommendations />
				</Col>

				{/* Coluna Central (feed e search) */}
				<Col md={6}>
					<SearchBar onSearch={handleSearch} />

					<div className="mt-3">
						{loading && (
							<div className="text-center my-4">
								<Spinner animation="border" variant="primary" />
							</div>
						)}

						{/* Resultado da Busca de Usuários */}
						{!loading && searchQuery && searchType === 'users' && (
							<div className="bg-white rounded shadow-sm border overflow-hidden">
								<div className="p-3 border-bottom bg-light">
									<h6 className="m-0 fw-bold text-secondary">Usuários encontrados</h6>
								</div>
								<ListGroup variant="flush">
									{userResults.length > 0 ? (
										userResults.map(user => {
											const avatarSrc = user.fotoPerfil ? getImageUrl(user.fotoPerfil) : DEFAULT_AVATAR;

											return (
												<ListGroup.Item key={user.id} className="d-flex align-items-center p-3 action-hover">
													<Image
														src={avatarSrc}
														roundedCircle
														width={40}
														height={40}
														className="me-3 border bg-secondary"
														style={{ objectFit: 'cover' }}
													/>
													<div className="flex-grow-1">
														<Link to={`/user/${user.id}`} className="fw-bold text-dark text-decoration-none stretched-link">
															{user.nome}
														</Link>
													</div>
													<small className="text-primary fw-semibold">Ver Perfil</small>
												</ListGroup.Item>
											);
										})
									) : (
										<div className="p-4 text-center text-muted">
											Nenhum usuário encontrado para "<strong>{searchQuery}</strong>".
										</div>
									)}
								</ListGroup>
							</div>
						)}

						{/* Feed ou Busca de Posts */}
						{!loading && (searchType === 'posts' || !searchQuery) && (
							<div>
								{searchQuery && (
									<Alert variant="light" className="d-flex justify-content-between align-items-center shadow-sm border">
										<span>Resultados para: <strong>{searchQuery}</strong></span>
										<Button variant="close" size="sm" onClick={() => handleSearch('', 'posts')} />
									</Alert>
								)}

								{posts.length > 0 ? (
									posts.map(post => <PostCard key={post.id} post={post} />)
								) : (
									<div className="text-center py-5 text-muted">
										<p className="mb-2">Não há publicações para exibir.</p>
										{searchQuery && (
											<Button variant="link" className="text-decoration-none" onClick={() => handleSearch('', 'posts')}>
												Limpar busca e ver tudo
											</Button>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</Col>

				{/* Coluna da Direita */}
				<Col md={3} className="d-none d-md-block">
					<AnonymousQuotes />
				</Col>
			</Row>
		</Container>
	);
}