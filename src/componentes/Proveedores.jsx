import React, { useState, useEffect } from 'react';

const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?';
//https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?rutempresaproveedor=77.653.382-3&ticket=AC3A098B-4CD0-41AF-81A5-41284248419B

//https://api.mercadopublico.cl/servicios/v1/Publico/Empresas/BuscarProveedor?rutempresaproveedor=77.653.382-3&ticket=AC3A098B-4CD0-41AF-81A5-41284248419B

function Proveedores() {
  const [ticket, setTicket] = useState('AC3A098B-4CD0-41AF-81A5-41284248419B');
  const [rutProveedor, setRutProveedor] = useState('');
  const [fechaConsulta, setFechaConsulta] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validarRut = (rut) => {
    // Expresión regular para validar el formato del RUT (con puntos y guión)
    const rutRegex = /^[0-9]{1,3}(\.[0-9]{3}){2}-[0-9kK]$/;
    if (!rutRegex.test(rut)) {
      return false;
    }

    // Validación del dígito verificador
    const partes = rut.split('-');
    const cuerpo = partes[0].replace(/\./g, '');
    const dv = partes[1].toLowerCase();
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dvCalculado = resto === 1 ? 'k' : resto === 0 ? '0' : (11 - resto).toString();

    return dv === dvCalculado;
  };

  const handleBuscar = async () => {
    const rutIngresado = rutProveedor.trim(); // Capturar el RUT ingresado y eliminar espacios en blanco
    if (!rutIngresado) {
      setError("El campo RUT no puede estar vacío. Por favor, ingrese un RUT.");
      return;
    }

    if (!/^[0-9]{1,3}(\.[0-9]{3}){2}-[0-9kK]$/.test(rutIngresado)) {
      setError("El RUT ingresado no tiene el formato correcto. Ejemplo: 12.345.678-9.");
      return;
    }

    if (!validarRut(rutIngresado)) {
      setError("El RUT ingresado no es válido. Verifique el dígito verificador.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_SERVICES}rutempresaproveedor=${rutIngresado}&ticket=${ticket}`, { // Corrige la URL de la API
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log("Estado de la respuesta:", response.status);
      if (response.status === 500) {
        console.warn("Error 500 detectado. Respuesta omitida.");
        return;
      }
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Respuesta de la API:", data); // Mostrar respuesta completa de la API en la consola

      // Validar estructura de la respuesta
      if (!data || typeof data !== 'object' || !data.listaEmpresas || !Array.isArray(data.listaEmpresas)) {
        throw new Error("La respuesta de la API no tiene el formato esperado.");
      }

      console.log("Datos procesados:", { FechaCreacion: data.FechaCreacion, listaEmpresas: data.listaEmpresas }); // Mostrar datos procesados

      const fechaActual = new Date().toLocaleString();
      setFechaConsulta(fechaActual);
      setResultados(data.listaEmpresas.map((empresa) => ({
        FechaCreacion: new Date(data.FechaCreacion).toLocaleDateString(), // Mostrar solo la fecha
        CodigoEmpresa: empresa.CodigoEmpresa,
        NombreEmpresa: empresa.NombreEmpresa,
      }))); // Ajustar resultados para incluir FechaCreacion y datos de listaEmpresas
    } catch (err) {
      console.error("Error al realizar la búsqueda:", err);
      setError("Ocurrió un error al realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setRutProveedor('');
    setFechaConsulta('');
    setResultados([]);
    setError(null);
  };

  return (
    <div className="container mt-5">
      <table className="table table-striped">
        <thead>
          <tr>
            <th colSpan="3" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Busqueda de Proveedores
            </th>
          </tr>
        </thead>
      </table>
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="ticket" className="form-label">Ticket</label>
          <input
            type="text"
            id="ticket"
            className="form-control"
            value={ticket}
            readOnly
            disabled
            placeholder="Ticket de acceso a la API"
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
            placeholder="Ejemplo: 12.345.678-9"
            required
            pattern="^[0-9]{1,3}(\.[0-9]{3}){2}-[0-9kK]$" // Validación básica de HTML
          />
        </div>
      </div>
      <div className="text-center mb-4">
        <button className="btn btn-primary me-2" onClick={handleBuscar} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button className="btn btn-secondary" onClick={handleLimpiar} disabled={loading}>Limpiar filtros</button>
      </div>
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      <div className="mb-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th colSpan="3" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Resultados {fechaConsulta && `- Fecha de consulta: ${fechaConsulta}`}
              </th>
            </tr>
            <tr style={{ backgroundColor: '#343a40', color: '#ffffff' }}>
              <th>Fecha de Creación</th>
              <th>Código Empresa</th>
              <th>Nombre Empresa</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado, index) => (
              <tr key={index}>
                <td>{resultado.FechaCreacion || 'No disponible'}</td>
                <td>{resultado.CodigoEmpresa || 'No disponible'}</td>
                <td>{resultado.NombreEmpresa || 'No disponible'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Proveedores;
