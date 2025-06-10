import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer
      className="text-white bg-dark"
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        height: 'auto',
        padding: '0.5rem 0', // Minimal padding for content spacing
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-4 text-start d-flex">
            <div
              style={{
                borderLeft: '2px solid white',
                height: '100%',
                marginRight: '10px',
              }}
            ></div>
            <div>
              <h6 style={{ textDecoration: 'underline', textDecorationColor: 'blue', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}>Dirección</h6>
              <p className="mb-1">• Avda Eucaliptus 1809, Zapallar, Valparaiso, Chile</p>
            </div>
          </div>
          <div className="col-md-4 text-start d-flex">
            <div
              style={{
                borderLeft: '2px solid white',
                height: '100%',
                marginRight: '10px',
              }}
            ></div>
            <div>
              <h6 style={{ textDecoration: 'underline', textDecorationColor: 'blue', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}>Contacto</h6>
              <p className="mb-1">• Email: contacto@empresa.com</p>
              <p>• Teléfono: +123 456 789</p>
            </div>
          </div>
          <div className="col-md-4 text-start d-flex">
            <div
              style={{
                borderLeft: '2px solid white',
                height: '100%',
                marginRight: '10px',
              }}
            ></div>
            <div>
              <h6 style={{ textDecoration: 'underline', textDecorationColor: 'blue', textUnderlineOffset: '6px', textDecorationThickness: '2px' }}>Redes Sociales</h6>
              <i className="bi bi-facebook text-white mx-2" style={{ fontSize: '1.5rem' }}></i>
              <i className="bi bi-twitter text-white mx-2" style={{ fontSize: '1.5rem' }}></i>
              <i className="bi bi-instagram text-white mx-2" style={{ fontSize: '1.5rem' }}></i>
              <i className="bi bi-linkedin text-white mx-2" style={{ fontSize: '1.5rem' }}></i>
              <i className="bi bi-tiktok text-white mx-2" style={{ fontSize: '1.5rem' }}></i>
              <i className="bi bi-whatsapp text-white mx-2" style={{ fontSize: '1.5rem' }}></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
