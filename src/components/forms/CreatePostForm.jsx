import { useState } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import postService from '../../services/postService';

/**
 * Formulário de criação de novas publicações.
 *
 * @component
 * @description
 * Apresenta uma área de texto para o usuário digitar e enviar um novo post.
 * Gerencia internamente o estado de `loading` para evitar múltiplos envios (duplo clique)
 * e exibe um Spinner durante a requisição.
 *
 * @param {Object} props
 * @param {function(Object): void} props.onPostCreated - Callback executado após o sucesso da criação.
 * Recebe o objeto do novo post como argumento para que o componente pai possa atualizar a lista
 * visualmente sem precisar recarregar a página (atualização otimista/imediata).
 */
export default function CreatePostForm({ onPostCreated }) {
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!texto.trim()) return;

        setLoading(true);
        try {
            const newPost = await postService.createPost(texto);
            setTexto(''); // Limpa o campo
            if (onPostCreated) onPostCreated(newPost); // Avisa o pai
        } catch (error) {
            console.error("Erro ao criar post", error);
            alert("Erro ao publicar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="my-4 mb-4 shadow-sm border-0">
            <Card.Body className='m-8'>
                <h6 className="mb-3 text-muted">No que você está pensando?</h6>
                <Form onSubmit={handleSubmit}>
                    {/* Texto */}
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Escreva algo novo..."
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            style={{ resize: 'none', backgroundColor: '#f8f9fa', border: 'none' }}
                        />
                    </Form.Group>

                    {/* Botão de Publicar */}
                    <div className="d-flex justify-content-end">
                        <Button type="submit" variant="primary" disabled={loading || !texto.trim()} className="rounded-pill px-4">
                            {loading ? <Spinner size="sm" /> : 'Publicar'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}