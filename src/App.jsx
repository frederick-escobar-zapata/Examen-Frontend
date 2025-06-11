import { useState } from 'react'
import './App.css'
import Header from './componentes/Header.jsx'
import ApiLicitaciones from './componentes/ApiLicitaciones.jsx'
import Proveedores from './componentes/Proveedores.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  const [currentView, setCurrentView] = useState('inicio'); // Estado inicial para manejar la vista actual

  const handleNavigation = (view) => {
    setCurrentView(view); // Cambiar la vista actual
  };

  return (
    <>
      <Header onNavigate={handleNavigation} />
      <section className="intro" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', width: '100%' }}>
        <p>
          Actualmente trabajamos con datos de <strong>Mercado Público</strong>, pero pronto ofreceremos
          una experiencia centralizada para explorar licitaciones, buscar proveedores y más.
        </p>
      </section>

      <section className="modules" style={{ width: '100%' }}>
        <div className="d-flex" style={{ height: 'calc(100vh - 200px)', marginTop: '20px' }}>
          <div className="flex-grow-1" style={{ overflowY: 'auto', padding: '20px' }}>
            {currentView === 'inicio' && <ApiLicitaciones />}
            {currentView === 'licitaciones' && <ApiLicitaciones />}
            {currentView === 'BusquedaProveedores' && <Proveedores />}
          </div>
        </div>
      </section>
    </>
  )
}

export default App
