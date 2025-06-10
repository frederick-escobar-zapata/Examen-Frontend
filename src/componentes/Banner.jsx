import React from 'react'
import Carrusel from './Carrusel.jsx'
import Formulario from './Formulario.jsx'
import ApiSecciones from './ApiSecciones.jsx'
import ApiPreguntas from './ApiPreguntas.jsx'
import ApiProductos from './ApiProductos.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


function Banner() {
  const slides = [
    {
      image: 'https://1.bp.blogspot.com/-zKX8CREi3QY/T2OMZgW3s6I/AAAAAAAAWzg/5sFH754c6sw/s1600/Los-mas-Hermosos-Paisajes-Naturales_04.jpg',
      alt: 'Primera diapositiva',
      title: 'Bienvenido a Antigüedades Sthandier',
      description: 'Descubre nuestra colección única de antigüedades.',
    },
    {
      image: 'https://i.pinimg.com/736x/c2/3c/1f/c23c1f5d86a5b28759bef7ffeef2a350.jpg',
      alt: 'Segunda diapositiva',
      title: 'Historia y autenticidad',
      description: 'Cada pieza cuenta una historia única.',
    },
    {
      image: 'https://th.bing.com/th/id/OIP._-4kglKMKFNaTWV1QAu2CwHaFj?cb=iwc2&w=1152&h=864&rs=1&pid=ImgDetMain',
      alt: 'Tercera diapositiva',
      title: 'Explora nuestra colección',
      description: 'Encuentra la pieza perfecta para tu hogar.',
    },
  ];

  return (
    <div className="container-fluid my-5" style={{ padding: 0 }}>
      <div
        id="inicio"
        className="box"
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '60px 20px',
          background: '#e0e7ff',
          textAlign: 'center',
          borderRadius: '12px',
          //marginTop: '110px' // baja el primer container para que no se oculte el título
        }}
      >
        <h2>Bienvenido a Antigüedades Sthandier</h2>

        <Carrusel slides={slides} />
        
      </div>
      <div
        id="sobre-nosotros"
        className="box"
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '60px 20px',
          background: '#adc0ff',
          textAlign: 'center',
          borderRadius: '12px',
        }}
      >
        <h2>Sobre Nosotros - Quiénes somos</h2>
        <ApiSecciones/> {/* Pasa el nombre de la sección */}
      </div>
      <div
        id="productos"
        className="box"
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '60px 20px',
          background: '#e0e7ff',
          textAlign: 'center',
          borderRadius: '12px',
          //marginTop: '110px' // baja las siguientes secciones también
        }}
      >
        <h2>Nuestros Productos </h2>
        <ApiProductos/>
      </div>

      <div
        id="preguntas-frecuentes"
        className="box"
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '60px 20px',
          background: '#adc0ff',
          textAlign: 'center',
          borderRadius: '12px',
        }}
      >
        <h2>Preguntas frecuentes</h2>
        <ApiPreguntas /> {/* Pasa el nombre de la sección */}
      </div>

      <div
        id="contacto"
        className="box"
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '60px 20px',
          background: '#e0e7ff',
          textAlign: 'center',
          borderRadius: '12px',
          marginTop: '110px' // baja la última sección
        }}
      >
        <h2>Contáctanos</h2>       
        <Formulario />
      </div>
    </div>
  )
}

export default Banner
