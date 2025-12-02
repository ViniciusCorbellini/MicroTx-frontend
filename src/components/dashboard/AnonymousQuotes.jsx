import { useState, useEffect } from 'react';
import { Form, ListGroup, Button, Spinner } from 'react-bootstrap';
import quoteService from '../../services/quoteService';
import CreateQuoteModal from './CreateQuoteModal';

export default function AnonymousQuotes() {
	const [quotes, setQuotes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [showModal, setShowModal] = useState(false);

	// Carrega as últimas frases ao iniciar
	useEffect(() => {
		loadRecentQuotes();
	}, []);

	const loadRecentQuotes = async () => {
		setLoading(true);
		try {
			const data = await quoteService.getRecentQuotes();
			setQuotes(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// Lógica de Busca (Delay simples para não buscar a cada letra digitada)
	useEffect(() => {
		const delayDebounceFn = setTimeout(async () => {
			if (search.trim()) {
				try {
					const results = await quoteService.searchQuotes(search);
					setQuotes(results);
				} catch (error) {
					console.error(error);
				}
			} else {
				// Se limpou a busca, carrega as recentes de novo
				loadRecentQuotes();
			}
		}, 500); // Espera 500ms após parar de digitar

		return () => clearTimeout(delayDebounceFn);
	}, [search]);

	// Função chamada quando uma frase é criada no modal
	const handleQuoteCreated = (newQuote) => {
		// Adiciona a nova frase no topo da lista atual
		setQuotes([newQuote, ...quotes]);
	};

	// Helper para formatar a hora de expiração
	const formatTime = (isoString) => {
		const date = new Date(isoString);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<>
			<div
				className="p-3 bg-white rounded-4 shadow-sm border border-light-subtle"
				style={{ position: 'sticky', top: '20px' }}
			>
				{/* Botão de criar */}
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h6 className="m-0 fw-bold text-secondary">Anônimos</h6>
					<Button
						variant="outline-dark"
						size="sm"
						className="success d-flex align-items-center justify-content-center"
						style={{ width: '40px', height: '28px' }}
						onClick={() => setShowModal(true)} //importante
						title="Nova frase"
					>
						<i>Criar</i>
					</Button>
				</div>

				{/* Input de Busca Compacto */}
				<Form.Control
					type="search"
					placeholder="Buscar..."
					size="sm"
					className="mb-3 bg-light border-0"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				{/* Lista de Frases */}
				{loading && !quotes.length ? (
					<div className="text-center py-3"><Spinner size="sm" variant="secondary" /></div>
				) : (
					<div style={{ maxHeight: '400px', overflowY: 'auto' }} className="custom-scrollbar">
						{quotes.length > 0 ? (
							<ListGroup variant="flush">
								{quotes.map(quote => (
									<ListGroup.Item key={quote.id} className="px-0 py-2 border-bottom border-light-subtle">
										<p className="mb-1 small fst-italic text-dark">"{quote.texto}"</p>
										<div className="d-flex justify-content-between align-items-center">
											<small className="text-muted" style={{ fontSize: '0.65rem' }}>
												{/* Mostra quando expira */}
												Expira às {formatTime(quote.dataExpiracao)}
											</small>
										</div>
									</ListGroup.Item>
								))}
							</ListGroup>
						) : (
							<p className="text-center text-muted small my-3">Nenhuma frase encontrada.</p>
						)}
					</div>
				)}
			</div>

			{/* Renderiza o Modal */}
			<CreateQuoteModal
				show={showModal}
				onHide={() => setShowModal(false)}
				onQuoteCreated={handleQuoteCreated}
			/>
		</>
	);
}