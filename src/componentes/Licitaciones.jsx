import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Asegúrate de importar Bootstrap JS
const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?ticket=AC3A098B-4CD0-41AF-81A5-41284248419B';
const API_BASE = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?'; // Base URL para las solicitudes de licitaciones
const API_TICKET = 'AC3A098B-4CD0-41AF-81A5-41284248419B'; // Define el ticket como constante

function Licitaciones() {
  const [dataServices, setDataServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [codigoFiltro, setCodigoFiltro] = useState(''); // Variable de estado donde se guarda la fecha formateada
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const itemsPerPage = 10; // Número de elementos por página

  const estados = {
    "5": "Publicada",
    "6": "Cerrada",
    "7": "Desierta",
    "8": "Adjudicada",
    "18": "Revocada",
    "19": "Suspendida",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseServices = await fetch(API_SERVICES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (responseServices.status === 500) {
          console.warn("Error 500 detectado. Respuesta omitida."); // Mostrar omisión por consola
          return; // Omitir el error y continuar
        }

        if (!responseServices.ok) {
          throw new Error(`Error al obtener los datos: ${responseServices.status} ${responseServices.statusText}`);
        }

        const dataServices = await responseServices.json();

        if (!dataServices.Listado || !Array.isArray(dataServices.Listado)) {
          throw new Error("La respuesta de la API no contiene un listado válido.");
        }

        setDataServices(dataServices.Listado);
      } catch (error) {
        console.error("Error al procesar la respuesta de la API:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterByName = () => {
    const filtered = dataServices.filter((licitacion) =>
      licitacion.Nombre.toLowerCase().includes(nombreFiltro.trim().toLowerCase())
    );
    setFilteredResults(filtered);
  };

  const handleFilterByCode = () => {
    const filtered = dataServices.find((licitacion) =>
      licitacion.CodigoExterno.toLowerCase() === codigoFiltro.trim().toLowerCase()
    );
    setFilteredResults(filtered ? [filtered] : []); // Si existe, mostrarlo; si no, lista vacía
  };

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage); // Total de páginas
  const currentItems = filteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // Elementos de la página actual

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 10 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        );
      } else if (i === totalPages - 1 && totalPages > 11) {
        pages.push(
          <li key="ellipsis" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }
    return pages;
  };

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
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h5 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#343a40' }}>Búsqueda de Licitaciones</h5>
      <ul className="nav nav-tabs mb-4" id="licitacionesTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="buscar-nombre-tab"
            data-bs-toggle="tab"
            data-bs-target="#buscar-nombre"
            type="button"
            role="tab"
            aria-controls="buscar-nombre"
            aria-selected="true"
          >
            Nombre Licitación
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="buscar-codigo-tab"
            data-bs-toggle="tab"
            data-bs-target="#buscar-codigo"
            type="button"
            role="tab"
            aria-controls="buscar-codigo"
            aria-selected="false"
          >
            Código Licitación
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="buscar-fecha-tab"
            data-bs-toggle="tab"
            data-bs-target="#buscar-fecha"
            type="button"
            role="tab"
            aria-controls="buscar-fecha"
            aria-selected="false"
          >
            Por Fecha
          </button>
        </li>
      </ul>
      <div className="tab-content" id="licitacionesTabsContent">
        <div
          className="tab-pane fade show active"
          id="buscar-nombre"
          role="tabpanel"
          aria-labelledby="buscar-nombre-tab"
        >
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="nombreFiltro" className="form-label">Ingrese Nombre Licitación</label>
              <input
                type="text"
                id="nombreFiltro"
                className="form-control"
                placeholder="Ejemplo: Licitación de servicios"
                value={nombreFiltro}
                onChange={(e) => setNombreFiltro(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={handleFilterByName}>Filtrar</button>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="buscar-codigo"
          role="tabpanel"
          aria-labelledby="buscar-codigo-tab"
        >
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="codigoFiltro" className="form-label">Ingrese el Código de Licitación</label>
              <input
                type="text"
                id="codigoFiltro"
                className="form-control"
                placeholder="Ejemplo: 123456"
                value={codigoFiltro}
                onChange={(e) => setCodigoFiltro(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={handleFilterByCode}>Buscar por Código</button>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="buscar-fecha"
          role="tabpanel"
          aria-labelledby="buscar-fecha-tab"
        >
          <div className="row mb-4 align-items-center">
            <div className="col-md-4">
              <label htmlFor="fechaFiltro" className="form-label">Ingrese la Fecha</label>
              <input
                type="date"
                id="fechaFiltro"
                className="form-control"
                max={new Date().toISOString().split('T')[0]} // Deshabilitar fechas posteriores a la fecha actual
                onChange={(e) => {
                  const rawDate = new Date(e.target.value);
                  const formattedDate = `${String(rawDate.getDate()).padStart(2, '0')}${String(rawDate.getMonth() + 1).padStart(2, '0')}${rawDate.getFullYear()}`;
                  setCodigoFiltro(formattedDate); // Guardar la fecha formateada en la variable de estado
                }}
              />
            </div>
            <div className="col-md-8">
              <p className="text-muted mb-0">
                Se listarán las licitaciones con cuelquier estado del día ingresado
              </p>
            </div>
          </div>
          <div className="text-center mb-4">
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  // Validar que `codigoFiltro` tenga un valor antes de construir la URL
                  if (!codigoFiltro) {
                    console.error("La fecha formateada no está definida. Por favor, ingrese una fecha válida.");
                    return;
                  }

                  // Construir correctamente la URL
                  const apiUrl = `${API_BASE}fecha=${codigoFiltro}&ticket=${API_TICKET}`;
                  console.log("URL enviada:", apiUrl); // Imprimir la URL por consola

                  const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    },
                  });

                  if (response.status === 500) { // Usar `response` en lugar de `responseServices`
                    console.warn("Error 500 detectado. Respuesta omitida."); // Mostrar omisión por consola
                    return; // Omitir el error y continuar
                  }

                  if (!response.ok) {
                    throw new Error(`Error al consumir la API: ${response.status} ${response.statusText}`);
                  }

                  const data = await response.json();
                  console.log("Resultado JSON obtenido:", JSON.stringify(data, null, 2)); // Mostrar el resultado JSON en formato legible
                  setFilteredResults(data.Listado || []); // Actualizar los resultados filtrados
                } catch (error) {
                  console.error("Error al consumir la API:", error);
                }
              }}
            >
              Buscar por Fecha
            </button>
          </div>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr style={{ backgroundColor: '#343a40', color: '#ffffff' }}>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Código Externo</th>
            <th>Fecha de Cierre</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((licitacion, index) => (
            <tr key={index}>
              <td>{licitacion.Nombre}</td>
              <td>{estados[licitacion.CodigoEstado] || "Estado desconocido"}</td>
              <td>{licitacion.CodigoExterno}</td>
              <td>{licitacion.FechaCierre ? new Date(licitacion.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          {renderPagination()}
        </ul>
      </nav>
    </div>
  );
}

export default Licitaciones;
