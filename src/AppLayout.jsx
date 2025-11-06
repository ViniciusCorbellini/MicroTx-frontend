// src/AppLayout.jsx
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

function AppLayout() {
  return (
    <>
      <NavBar />
      <main className="container mt-4">
        <Outlet /> {/* As pages filhas (Dashboard, Profile) serao renderizadas aqui */}
      </main>
    </>
  );
}; 
export default AppLayout;
