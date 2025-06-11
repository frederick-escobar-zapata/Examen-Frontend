import React, { useState, useEffect } from 'react';
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
        <a className="navbar-brand" href="#inicio">Licita Seguro</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {['inicio', 'Licitaciones', 'Proveedores'].map((section, index, array) => (
              <React.Fragment key={section}>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href={`#${section}`}
                    onClick={cerrar}
                    style={{
                      fontWeight: activeSection === section ? 'bold' : 'normal',
                      fontSize: activeSection === section ? '1.2rem' : '1rem',
                    }}
                  >
                    {section === 'inicio' && 'Inicio'}
                    {section === 'Licitaciones' && 'Licitaciones'}
                    {section === 'Proveedores' && 'Proveedores'}
                    
                  </a>
                </li>
                {index < array.length - 1 && (
                  <div
                    className="d-none d-lg-block"
                    style={{
                      borderLeft: '2px solid blue',
                      height: '1.5rem',
                      margin: '10px auto 0',
                    }}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;