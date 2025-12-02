import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import postService from '../../services/postService';


/**
 * Modal para edição de conteúdo de uma publicação existente.
 *
 * @component
 * @description
 * Exibe um campo de texto pré-preenchido com o conteúdo atual do post.
 * Ao salvar, chama a API e notifica o componente pai para atualizar a lista localmente.
 *
 * @param {Object} props
 * @param {boolean} props.show - Controla a visibilidade do modal.
 * @param {function} props.onHide - Função para fechar o modal.
 * @param {Object} props.post - O objeto do post original a ser editado.
 * @param {function(Object): void} props.onUpdate - Callback executado após o sucesso da edição.
 * Recebe o objeto do post atualizado para que a UI reflita a mudança imediatamente.
 */
export default function EditPostModal({ show, onHide, post, onUpdate }) {
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Sincroniza o estado local do formulário sempre que o post selecionado muda.
     * Isso garante que o input não exiba dados de um post anterior ao abrir o modal.
     */
    useEffect(() => {
        if (post) setTexto(post.texto);
    }, [post]);

    const handleSave = async () => {
        if (!post) return;
        setLoading(true);
        try {
            const updatedPost = await postService.updatePost(post.id, texto);
            onUpdate(updatedPost); // Atualiza a lista no pai
            onHide();
        } catch (error) {
            console.error("Erro ao atualizar", error);
            alert("Erro ao salvar alterações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Publicação</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancelar</Button>
                <Button variant="primary" onClick={handleSave} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}