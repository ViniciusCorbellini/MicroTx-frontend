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

/**
 * Painel Principal (Feed).
 *
 * @description
 * Componente central da aplicação que gerencia:
 * 1. **Scroll Infinito:** Carregamento progressivo de posts ao rolar a página.
 * 2. **Busca Híbrida:** Alternância dinâmica entre buscar Posts ou Usuários.
 * 3. **Layout Responsivo:** Gerencia as colunas laterais (Recomendações/Citações) que somem em telas menores.
 */
export default function Dashboard() {
	// Estados da Busca
	const [searchQuery, setSearchQuery] = useState('');
	const [searchType, setSearchType] = useState('posts');

	// Estados de Dados
	const [posts, setPosts] = useState([]);
	const [userResults, setUserResults] = useState([]);
	const [loading, setLoading] = useState(false);

	// Estados pra paginação
	const [page, setPage] = useState(0); // Página atual
	const [hasMore, setHasMore] = useState(true); // Se ainda tem mais posts pra buscar

	// Carrega a primeira página ao montar
	useEffect(() => {
		loadFeed(0); // Força página 0
	}, []);

	/**
     * Listener de Scroll para Paginação.
     * Dispara `loadFeed` quando o usuário chega a 200px do fim da página.
     * Só executa se não houver busca ativa e não estiver carregando.
     */
	useEffect(() => {
		const handleScroll = () => {
			// Verifica se chegou perto do fim da página (deslocamento de 200px)
			if (
				window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 &&
				!loading &&
				hasMore &&
				!searchQuery // Só pagina se NÃO estiver buscando
			) {
				loadFeed(page); // Carrega a próxima página
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [loading, hasMore, searchQuery, page]);

	/**
     * Busca dados do feed no backend.
     *
     * @param {number} pageNumber - Índice da página a ser buscada (começa em 0).
     * @description
     * - Se `pageNumber === 0`: Substitui a lista atual (Refresh/Primeira carga).
     * - Se `pageNumber > 0`: Adiciona (concatena) os novos itens ao final da lista existente.
     * - Atualiza `hasMore` verificando se a página atual é a última (`data.last`).
     */
	const loadFeed = async (pageNumber) => {
		setLoading(true);
		try {
			// Chama o serviço passando a página solicitada
			const data = await postService.getFeed(pageNumber, 10);

			if (pageNumber === 0) {
				// Se for a primeira página, substitui tudo
				setPosts(data.content);
			} else {
				// Se for paginação, ADICIONA aos posts existentes
				setPosts(prevPosts => [...prevPosts, ...data.content]);
			}

			// Atualiza controle de paginação
			// 'last' é uma propriedade do Spring Page que diz se é a última página
			setHasMore(!data.last);
			setPage(pageNumber + 1); // Prepara o ponteiro para a próxima

		} catch (error) {
			console.error("Erro ao carregar feed", error);
		} finally {
			setLoading(false);
		}
	};

	/**
     * Controlador da barra de busca.
     *
     * @param {string} query - O termo digitado pelo usuário.
     * @param {'posts'|'users'} type - O tipo de entidade a buscar.
     * @description
     * 1. Reseta a paginação (setPage 0) e desativa o scroll infinito temporariamente.
     * 2. Se `query` for vazia, restaura o feed original.
     * 3. Decide qual serviço chamar (`postService` ou `userService`) baseado no `type`.
     */
	const handleSearch = async (query, type) => {
		setSearchQuery(query);
		setSearchType(type);
		setLoading(true);

		// Reseta paginação ao buscar
		setPage(0);
		setHasMore(false); // Desativa scroll infinito durante busca (endpoints de busca não são paginados ainda)

		try {
			if (!query.trim()) {
				// Se limpou a busca, recarrega o feed do zero
				setHasMore(true); // Reativa scroll
				await loadFeed(0);
				return; // O finally vai tirar o loading
			}

			if (type === 'posts') {
				const results = await postService.searchPosts(query);
				setPosts(results);
			} else {
				const results = await userService.searchUsers(query);
				setUserResults(results);
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
				<Col md={3} className="d-none d-md-block">
					<Recommendations />
				</Col>

				<Col md={6}>
					<SearchBar onSearch={handleSearch} />

					<div className="mt-3">
						{/* Lógica de Usuários Encontrados */}
						{!loading && searchQuery && searchType === 'users' && (
							<div className="bg-white rounded shadow-sm border overflow-hidden">
								<ListGroup variant="flush">
									{userResults.map(user => (
										<ListGroup.Item key={user.id} className="d-flex align-items-center p-3">
											<Image src={getImageUrl(user.fotoPerfil)} roundedCircle width={40} height={40} className="me-3" />
											<Link to={`/user/${user.id}`} className="fw-bold text-dark text-decoration-none flex-grow-1">{user.nome}</Link>
										</ListGroup.Item>
									))}
								</ListGroup>
							</div>
						)}

						{/* Feed ou Busca de Posts */}
						{(searchType === 'posts' || !searchQuery) && (
							<div>
								{searchQuery && (
									<Alert variant="light" className="d-flex justify-content-between align-items-center shadow-sm border mb-3">
										<span>Resultados para: <strong>{searchQuery}</strong></span>
										<Button variant="close" size="sm" onClick={() => handleSearch('', 'posts')} />
									</Alert>
								)}

								{posts.length > 0 ? (
									<>
										{posts.map(post => <PostCard key={post.id} post={post} />)}

										{/* Indicador de Loading no final da página (Scroll Infinito) */}
										{loading && !searchQuery && (
											<div className="text-center py-3">
												<Spinner animation="border" size="sm" variant="secondary" />
												<small className="ms-2 text-muted">Carregando mais...</small>
											</div>
										)}

										{/* Indicador de Fim do Feed */}
										{!hasMore && !searchQuery && posts.length > 5 && (
											<p className="text-center text-muted small mt-4">Você chegou ao fim. Que tal fazer uma pausa?</p>
										)}
									</>
								) : (
									!loading && (
										<div className="text-center py-5 text-muted">
											<p className="mb-2">Não há publicações para exibir.</p>
											{searchQuery && <Button variant="link" onClick={() => handleSearch('', 'posts')}>Limpar busca</Button>}
										</div>
									)
								)}
							</div>
						)}

						{/* Spinner inicial (apenas quando não tem posts ainda) */}
						{loading && posts.length === 0 && (
							<div className="text-center my-4">
								<Spinner animation="border" variant="primary" />
							</div>
						)}
					</div>
				</Col>

				<Col md={3} className="d-none d-md-block">
					<AnonymousQuotes />
				</Col>
			</Row>
		</Container>
	);
}