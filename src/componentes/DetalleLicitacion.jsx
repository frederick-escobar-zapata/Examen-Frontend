import React, { useEffect, useState } from 'react';
const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?';
const ticket = 'AC3A098B-4CD0-41AF-81A5-41284248419B';

function DetalleLicitacion({ codigoExterno, onBack }) {
  const [dataServices, setDataServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseServices = await fetch(API_SERVICES + "codigo=" + codigoExterno + "&ticket=" + ticket, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        console.log("Estado de la respuesta:", responseServices.status);
        if (responseServices.status === 500) {
          console.warn("Respuesta omitida debido a error 500.");
          return;
        }
        if (!responseServices.ok) {
          throw new Error(`Error al obtener los datos: ${responseServices.status} ${responseServices.statusText}`);
        }
        const data = await responseServices.json();
        console.log("Respuesta completa de la API:", data);

        if (!data || typeof data !== 'object' || !data.Listado || !Array.isArray(data.Listado)) {
          throw new Error("La respuesta de la API no tiene el formato esperado.");
        }

        setDataServices(data.Listado[0]);
      } catch (error) {
        console.error("Error al procesar la respuesta de la API:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [codigoExterno]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        <p>Error al cargar los datos: {error.message}</p>
      </div>
    );
  }

  try {
    if (!dataServices) {
      throw new Error("Los datos de la licitación no están disponibles.");
    }

    return (
      <div className="container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th colSpan="2" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                Detalle de Licitación
              </th>
            </tr>
          </thead>
        </table>
        <div className="card shadow-sm">
          <div className="card-body">
            <p><strong>Código Externo:</strong> {dataServices.CodigoExterno}</p>
            <p><strong>Nombre:</strong> {dataServices.Nombre}</p>
            <p style={{ textAlign: 'justify' }}><strong>Descripción:</strong>{dataServices.Descripcion}</p>
            <p><strong>Estado:</strong> {dataServices.Estado}</p>
            <p><strong>Días para Cierre:</strong> {dataServices.DiasCierreLicitacion}</p>
            <p><strong>Moneda:</strong> {dataServices.Moneda || 'No especificada'}</p>
            <p><strong>Cantidad:</strong> {dataServices.Cantidad || 'No especificada'}</p>
            <p><strong>Reclamos:</strong> {dataServices.Reclamos || 'No especificados'}</p>
          </div>
        </div>
        <div className="card shadow-sm mt-4">
          <div className="card-body" style={{ textAlign: 'left' }}>
            <h6 className="card-title mb-4" style={{ fontWeight: 'bold', color: '#007bff' }}>Información del Comprador</h6>
            <p><strong>Nombre del Organismo:</strong> {dataServices.Comprador?.NombreOrganismo}</p>
            <p><strong>RUT de la Unidad:</strong> {dataServices.Comprador?.RutUnidad}</p>
            <p><strong>Nombre de la Unidad:</strong> {dataServices.Comprador?.NombreUnidad}</p>
            <p><strong>Dirección de la Unidad:</strong> {dataServices.Comprador?.DireccionUnidad}</p>
            <p><strong>Comuna de la Unidad:</strong> {dataServices.Comprador?.ComunaUnidad}</p>
            <p><strong>Región de la Unidad:</strong> {dataServices.Comprador?.RegionUnidad}</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onBack}
          >
            Volver al Listado
          </button>
        </div>
      </div>
    );
  } catch (renderError) {
    console.error("Error al renderizar el componente DetalleLicitacion:", renderError);
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        <p>Error al mostrar los datos de la licitación.</p>
      </div>
    );
  }
}

export default DetalleLicitacion;
