import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import postService from '../../services/postService';

export default function EditPostModal({ show, onHide, post, onUpdate }) {
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(false);

    // Carrega o texto do post quando o modal abre
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