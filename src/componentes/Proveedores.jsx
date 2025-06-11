import React, { useState } from 'react';

function Proveedores() {
  const [ticket, setTicket] = useState('AC3A098B-4CD0-41AF-81A5-41284248419B');
  const [rutProveedor, setRutProveedor] = useState('');
  const [fechaConsulta, setFechaConsulta] = useState('');
  const [resultados, setResultados] = useState([]);

  const handleBuscar = () => {
    // Simular una consulta y actualizar resultados
    const fechaActual = new Date().toLocaleString();
    setFechaConsulta(fechaActual);
    setResultados([
      { codigoEmpresa: '1968779', nombreEmpresa: 'SERVICIOS Y SOLUCIONES INFORMÁTICAS FENRIR SPA' },
    ]);
  };

  const handleLimpiar = () => {
    setRutProveedor('');
    setFechaConsulta('');
    setResultados([]);
  };

  return (
    <div className="container mt-5">
      <h5 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#343a40' }}>Listado de Proveedores</h5>
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="ticket" className="form-label">Ticket</label>
          <input
            type="text"
            id="ticket"
            className="form-control"
            value={ticket}
            readOnly
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="rutProveedor" className="form-label">RUT Empresa Proveedor</label>
          <input
            type="text"
            id="rutProveedor"
            className="form-control"
            value={rutProveedor}
            onChange={(e) => setRutProveedor(e.target.value)}
          />
        </div>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-primary me-2" onClick={handleBuscar}>Buscar</button>
        <button className="btn btn-secondary" onClick={handleLimpiar}>Limpiar filtros</button>
      </div>
      <div className="mb-4">
        <h6>Resultados:</h6>
        {fechaConsulta && <p>Fecha de consulta: {fechaConsulta}</p>}
        <table className="table table-striped">
          <thead>
            <tr style={{ backgroundColor: '#343a40', color: '#ffffff' }}>
              <th>Código Empresa</th>
              <th>Nombre Empresa</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado, index) => (
              <tr key={index}>
                <td>{resultado.codigoEmpresa}</td>
                <td>{resultado.nombreEmpresa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Proveedores;
