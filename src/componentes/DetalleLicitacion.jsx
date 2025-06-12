import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?';
const ticket = 'AC3A098B-4CD0-41AF-81A5-41284248419B';

function DetalleLicitacion({ codigoExterno, onBack }) { // Recibe codigoExterno como propiedad
  console.log("Código Externo recibido:", codigoExterno); // Depuración del código externo

  const [dataServices, setDataServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!codigoExterno) {
        console.error("El código externo no está definido.");
        setError(new Error("El código externo no está definido."));
        setLoading(false);
        return;
      }

      try {
        const responseServices = await fetch(`${API_SERVICES}codigo=${codigoExterno}&ticket=${ticket}`, {
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
  }, [codigoExterno]); // Cambia la dependencia a codigoExterno

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

  if (!dataServices) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        <p>Los datos de la licitación no están disponibles.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th colSpan="2" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Detalles de la Licitación
            </th>
          </tr>
        </thead>
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
          <tr>
            <th>Descripción</th>
            <td>{dataServices.Descripcion || "Descripción no disponible"}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th colSpan="2" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Detalles del Comprador
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Nombre Organismo</th>
            <td>{dataServices.Comprador?.NombreOrganismo || "No disponible"}</td>
          </tr>
          <tr>
            <th>Rut Organismo</th>
            <td>{dataServices.Comprador?.RutUnidad || "No disponible"}</td>
          </tr>
          <tr>
            <th>Nombre Unidad</th>
            <td>{dataServices.Comprador?.NombreUnidad || "No disponible"}</td>
          </tr>
          <tr>
            <th>Dirección Unidad</th>
            <td>{dataServices.Comprador?.DireccionUnidad || "No disponible"}</td>
          </tr>
          <tr>
            <th>Comuna Unidad</th>
            <td>{dataServices.Comprador?.ComunaUnidad || "No disponible"}</td>
          </tr>
          <tr>
            <th>Región Unidad</th>
            <td>{dataServices.Comprador?.RegionUnidad || "No disponible"}</td>
          </tr>
          <tr>
            <th>Nombre Usuario</th>
            <td>{dataServices.Comprador?.NombreUsuario || "No disponible"}</td>
          </tr>
          <tr>
            <th>Cargo Usuario</th>
            <td>{dataServices.Comprador?.CargoUsuario || "No disponible"}</td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            console.log("Volviendo al listado..."); // Depuración del evento
            onBack(); // Ejecuta la función para volver al listado
          }}
        >
          Volver al Listado
        </button>
      </div>
    </div>
  );
}

export default DetalleLicitacion;
