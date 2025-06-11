import { useState } from 'react'
import reactLogo  from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import ApiLicitaciones from './componentes/ApiLicitaciones.jsx'
import Filtros from './componentes/Filtros';
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
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
            <ApiLicitaciones />
          </div>
        </div>
      </section>
     
    </>
  )
}

export default App
