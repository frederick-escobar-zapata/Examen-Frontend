import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?ticket=AC3A098B-4CD0-41AF-81A5-41284248419B';

function ApiLicitaciones() {
  const [dataServices, setDataServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Asegurar que el estado de carga se active
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simular un retraso de 2 segundos
        const responseServices = await fetch(API_SERVICES);
        if (!responseServices.ok) {
          throw new Error('Lo sentimos. Hemos detectado que existen peticiones simultáneas. Por favor, inténtelo de nuevo más tarde.');
        }
        const data = await responseServices.json();
        setDataServices(data.Listado || []);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(dataServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = dataServices.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert" style={{ fontSize: '1rem' }}>
        Lo sentimos. Hemos detectado que existen peticiones simultáneas. Por favor, inténtelo de nuevo más tarde.
      </div>
    );
  }

  return (
    <div className="container">
      <h6 className="mb-3 text-center">Listado de Licitaciones</h6>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código Externo</th>
            <th>Nombre</th>
            <th>Código Estado</th>
            <th>Fecha de Cierre</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((licitacion) => (
            <tr key={licitacion.CodigoExterno}>
              <td>{licitacion.CodigoExterno}</td>
              <td>{licitacion.Nombre}</td>
              <td>{licitacion.CodigoEstado}</td>
              <td>{new Date(licitacion.FechaCierre).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;

            // Mostrar las primeras 10 páginas y la última página
            if (pageNumber <= 10 || pageNumber === totalPages) {
              return (
                <li
                  key={index}
                  className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                    style={{ fontSize: '1rem' }}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            }

            // Mostrar puntos suspensivos después de la página 10
            if (pageNumber === 11) {
              return (
                <li key="ellipsis" className="page-item disabled">
                  <span className="page-link" style={{ fontSize: '1rem' }}>...</span>
                </li>
              );
            }

            // Mostrar páginas cercanas a la actual después de la página 10
            if (pageNumber > 10 && pageNumber < totalPages && (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
              return (
                <li
                  key={index}
                  className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                    style={{ fontSize: '1rem' }}
                  >
                    {pageNumber}
                  </button>
                </li>
              );
            }

            return null;
          })}
        </ul>
      </nav>
    </div>
  );
}

export default ApiLicitaciones;