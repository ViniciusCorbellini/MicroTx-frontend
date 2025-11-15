import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import Recommendations from '../components/dashboard/Recommendations';
import AnonymousQuotes from '../components/dashboard/AnonymousQuotes';
import SearchBar from '../components/forms/SearchBar';

//TODO: ENDPOINT DE RECOMENDACÃO PARA UM USUÁRIO
function Dashboard() {
  return (
    <Container fluid> {/* 'fluid' para ocupar mais espaço, ou remova para um container fixo */}
      <Row>
        {/* Coluna da Esquerda (Recomendações) */}
        <Col md={3}>
          <Recommendations />
        </Col>

        {/* Coluna Central (Feed e Pesquisa) */}
        <Col md={6}>
          <SearchBar />
          <div className="mt-4">
            {/* O feed principal de "Recomendações/Resultados" viria aqui */}
            <h4>Feed Principal (TODO)</h4>
          </div>
        </Col>

        {/* Coluna da Direita (Citações e Perfil) */}
        <Col md={3}>
          <AnonymousQuotes />
          {/* <ProfileCard /> */}
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;