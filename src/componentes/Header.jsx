import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [activeSection, setActiveSection] = useState('inicio');

  const handleScroll = () => {
    const sections = ['inicio', 'sobre-nosotros', 'productos', 'preguntas-frecuentes', 'contacto'];
    const offsets = sections.map((id) => {
      const element = document.getElementById(id);
      return element ? element.getBoundingClientRect().top : Infinity;
    });

    const activeIndex = offsets.findIndex((offset) => offset >= 0 && offset < window.innerHeight / 2);
    if (activeIndex !== -1) {
      setActiveSection(sections[activeIndex]);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cerrar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{
        width: '100%',
        margin: 0,
        left: 0,
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        overflowX: 'hidden',
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Licita Seguro</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <div style={{ borderLeft: '4px solid blue', height: 'auto', margin: '0 10px' }}></div> {/* Línea vertical */}
            <li className="nav-item">
              <Link className="nav-link" to="/BusquedaLicitaciones">Búsqueda de Licitaciones</Link>
            </li>
            <div style={{ borderLeft: '4px solid blue', height: 'auto', margin: '0 10px' }}></div> {/* Línea vertical */}
            <li className="nav-item">
              <Link className="nav-link" to="/BusquedaProveedores">Búsqueda de Proveedores</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;