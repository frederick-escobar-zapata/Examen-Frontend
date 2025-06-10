import { useState } from 'react'
import reactLogo  from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './componentes/Header.jsx'
import Footer from './componentes/Footer.jsx'
import ApiLicitaciones from './componentes/ApiLicitaciones.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Header />
       <section className="intro">
        <p>
          Actualmente trabajamos con datos de <strong>Mercado Público</strong>, pero pronto ofreceremos
          una experiencia centralizada para explorar licitaciones, buscar proveedores y más.
        </p>
      </section>

      <section className="modules">
       
        <ApiLicitaciones />

      </section>
     
    </>
  )
}

export default App
