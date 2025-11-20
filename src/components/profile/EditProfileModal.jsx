import { useState } from 'react';
import { Modal, Form, Image, Alert } from 'react-bootstrap';
import Button from '../common/Button';
import InputField from '../common/InputField';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileModal({ show, onHide }) {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Estado do formulário
    const [formData, setFormData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        senha: '' 
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Lida com mudança nos textos
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lida com a seleção do arquivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Cria preview local
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Chama o serviço passando os dados e o arquivo
            const updatedUser = await userService.updateProfile(formData, selectedFile);

            // Atualiza o contexto global com a resposta do backend
            updateUser(updatedUser);

            onHide(); // Fecha o modal
        } catch (err) {
            console.error(err);
            setError('Erro ao atualizar. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {/* Preview da img */}
                    <div className="text-center mb-4">
                        {preview ? (
                            <Image 
                                src={preview} 
                                roundedCircle 
                                width={100} 
                                height={100} 
                                className="d-block mx-auto"
                                style={{ objectFit: 'cover' }} 
                            />
                        ) : (
                            <p className="text-muted small">Nenhuma nova foto selecionada</p>
                        )}
                        <Form.Group className="mt-2">
                            <Form.Label className="btn btn-sm btn-outline-primary">
                                Escolher Foto (opcional)
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                            </Form.Label>
                        </Form.Group>
                    </div>

                    <InputField
                        label="Nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Nova Senha (opcional)"
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Deixe em branco para manter a atual"
                    />

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onHide} type="button">Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}