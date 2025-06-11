        import React from 'react';

function DetalleLicitacion({ codigoExterno }) {
  return (
    <div className="container">
      <h5 className="text-center">Detalle de Licitación</h5>
      <p className="text-center">Código Externo: {codigoExterno}</p>
    </div>
  );
}

export default DetalleLicitacion;
