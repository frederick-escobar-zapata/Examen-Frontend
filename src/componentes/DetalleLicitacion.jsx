import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?';
const ticket = 'AC3A098B-4CD0-41AF-81A5-41284248419B';

function DetalleLicitacion({ onBack }) {
  const location = useLocation();
  const { licitacion } = location.state || {}; // Recibe los datos enviados desde Licitaciones

  const [dataServices, setDataServices] = useState(licitacion || null);
  const [loading, setLoading] = useState(!licitacion);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (licitacion) {
        setLoading(false);
        return;
      }
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
  }, [licitacion]);

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
        <h5 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#343a40' }}>
          Detalle de la Licitación
        </h5>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Nombre</th>
              <td>{dataServices.Nombre}</td>
            </tr>
            <tr>
              <th>Estado</th>
              <td>{dataServices.CodigoEstado}</td>
            </tr>
            <tr>
              <th>Código Externo</th>
              <td>{dataServices.CodigoExterno}</td>
            </tr>
            <tr>
              <th>Fecha de Cierre</th>
              <td>{dataServices.FechaCierre ? new Date(dataServices.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
            </tr>
          </tbody>
        </table>
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
