import React, { useState } from 'react';

function Filtros({ onFilter }) {
  const [codigoExterno, setCodigoExterno] = useState('');
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('');

  const handleFilter = () => {
    onFilter({ codigoExterno, nombre, estado });
  };

  return (
    <div className="p-3 border" style={{ width: '250px', position: 'fixed', left: 0, top: 50, height: 'calc(100vh - 100px)', backgroundColor: '#343a40', color: '#ffffff' }}>
      <h5>Filtros</h5>
      <div className="mb-3">
        <label htmlFor="codigoExterno" className="form-label">Código Externo</label>
        <input
          type="text"
          id="codigoExterno"
          className="form-control"
          value={codigoExterno}
          onChange={(e) => setCodigoExterno(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">Nombre</label>
        <input
          type="text"
          id="nombre"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="estado" className="form-label">Estado</label>
        <input
          type="text"
          id="estado"
          className="form-control"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />
      </div>
      <button className="btn btn-primary w-100" onClick={handleFilter}>
        Aplicar Filtros
      </button>
    </div>
  );
}

export default Filtros;
