import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

// Recebe props para passar os dados para cima (para o Dashboard)
export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('posts'); // 'posts' ou 'users'

    const handleSubmit = (e) => {
        e.preventDefault();
        // Envia para o pai: o texto e o tipo de busca
        onSearch(query, type);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3 shadow-sm">
                {/* Select para escolher o tipo */}
                <Form.Select
                    style={{ maxWidth: '100px', backgroundColor: '#f8f9fa' }}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="posts">Posts</option>
                    <option value="users">Pessoas</option>
                </Form.Select>

                {/* Input de Texto */}
                <Form.Control
                    placeholder={type === 'posts' ? "Buscar posts..." : "Buscar pessoas..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <Button variant="primary" type="submit">
                    <i className="bi bi-search"></i> Buscar
                </Button>
            </InputGroup>
        </Form>
    );
}