import { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import quoteService from '../../services/quoteService';

export default function CreateQuoteModal({ show, onHide, onQuoteCreated }) {
	const [texto, setTexto] = useState('');
	const [duracao, setDuracao] = useState(60); // por padrão vai ser uma hora
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault(); // interrompe o comportamento padrão do navegador para fazer as validações
		if (!texto.trim()) return;

		setLoading(true);
		try {
			const newQuote = await quoteService.createQuote(texto, Number(duracao));
			onQuoteCreated(newQuote); // Avisa o pai para atualizar a lista
			setTexto(''); // Limpa
			onHide(); // Fecha
		} catch (error) {
			console.error("Erro ao criar frase", error);
			alert("Erro ao postar frase.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal show={show} onHide={onHide} centered size="sm">
			<Modal.Header closeButton>
				<Modal.Title style={{ fontSize: '1rem' }}>Nova Frase Anônima</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label className="small text-muted">Sua mensagem</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							value={texto}
							onChange={(e) => setTexto(e.target.value)}
							placeholder="Expresse-se..."
							required
						/>
					</Form.Group>

					{/* Tempo de expiração */}
					<Form.Group className="mb-3">
						<Form.Label className="small text-muted">Expira em (minutos)</Form.Label>
						<Form.Select
							value={duracao}
							onChange={(e) => setDuracao(e.target.value)}
							style={{ fontSize: '0.9rem' }}
						>
							<option value="10">10 minutos (Rápido)</option>
							<option value="30">30 minutos</option>
							<option value="60">1 hora</option>
							<option value="1440">24 horas</option>
						</Form.Select>
					</Form.Group>

					{/* Botão de envio */}
					<div className="d-grid">
						<Button type="submit" variant="dark" disabled={loading}> {/* Submit */}
							{loading ? <Spinner size="sm" /> : 'Postar Anônimo'}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
}