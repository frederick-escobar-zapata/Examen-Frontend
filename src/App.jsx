import './App.css';
import Header from './componentes/Header.jsx';
import ApiLicitaciones from './componentes/ApiLicitaciones.jsx';
import Proveedores from './componentes/Proveedores.jsx';
import Licitaciones from './componentes/Licitaciones.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DetalleLicitacion from './componentes/DetalleLicitacion';

function App() {
  return (
    <Router>
      <Header />
      <section className="intro" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', width: '100%' }}>
        <p>
          Actualmente trabajamos con datos de <strong>Mercado Público</strong>, pero pronto ofreceremos
          una experiencia centralizada para explorar licitaciones, buscar proveedores y más.
        </p>
      </section>

      <section className="modules" style={{ width: '100%' }}>
        <div className="d-flex" style={{ height: 'calc(100vh - 200px)', marginTop: '20px' }}>
          <div className="flex-grow-1" style={{ overflowY: 'auto', padding: '20px' }}>
            <Routes>
              <Route path="/" element={<ApiLicitaciones />} />
              <Route path="/BusquedaLicitaciones" element={<Licitaciones />} />
              <Route path="/BusquedaProveedores" element={<Proveedores />} />
              <Route path="/DetalleLicitacion" element={<DetalleLicitacion />} />
              <Route path="/inicio" element={<ApiLicitaciones />} /> {/* Ruta añadida */}
            </Routes>
          </div>
        </div>
      </section>
    </Router>
  );
}

export default App;
