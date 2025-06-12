import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Asegúrate de importar Bootstrap JS
import { useNavigate } from 'react-router-dom'; // Importa useNavigate desde react-router-dom
import DetalleLicitacion from './DetalleLicitacion'; // Asegúrate de importar el componente DetalleLicitacion
import { validateTextWithAccents, validateCode, validateDate } from '../utils/validations';

const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?ticket=AC3A098B-4CD0-41AF-81A5-41284248419B';
const API_BASE = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?'; // Base URL para las solicitudes de licitaciones
const API_TICKET = 'AC3A098B-4CD0-41AF-81A5-41284248419B'; // Define el ticket como constante

function Licitaciones() {
  const [dataServices, setDataServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [codigoFiltro, setCodigoFiltro] = useState(''); // Cambiar inicialización a cadena vacía
  const [filteredResults, setFilteredResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [selectedCodigoExterno, setSelectedCodigoExterno] = useState(null); // Estado para el Código Externo seleccionado
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

  if (selectedCodigoExterno) {
    return (
      <DetalleLicitacion
        codigoExterno={selectedCodigoExterno} // Pasa el código externo como propiedad
        onBack={() => {
          console.log("Volviendo al listado desde DetalleLicitacion..."); // Depuración del evento
          setSelectedCodigoExterno(null); // Restablece el estado para volver al listado
        }}
      />
    );
  }

  return (
    <div className="container mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
              Búsqueda de Licitaciones
            </th>
          </tr>
        </thead>
      </table>
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
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="buscar-estado-tab"
            data-bs-toggle="tab"
            data-bs-target="#buscar-estado"
            type="button"
            role="tab"
            aria-controls="buscar-estado"
            aria-selected="false"
          >
            Por Estado
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="buscar-fecha-estado-tab"
            data-bs-toggle="tab"
            data-bs-target="#buscar-fecha-estado"
            type="button"
            role="tab"
            aria-controls="buscar-fecha-estado"
            aria-selected="false"
          >
            Fecha y Estado
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (!validateTextWithAccents(value)) {
                    alert("Caracteres inválidos. Solo se permiten letras, puntos, comas y acentos.");
                    return;
                  }
                  //console.log("Nombre ingresado:", value); // Mostrar el nombre ingresado en la consola
                  setNombreFiltro(value);
                }}
              />
            </div>
          </div>
          <div className="text-center mb-4">
            <button
              className="btn btn-primary"
              onClick={() => {
                const filtered = dataServices.filter((licitacion) =>
                  licitacion.Nombre.toLowerCase().includes(nombreFiltro.trim().toLowerCase())
                );
                console.log("Resultados filtrados por nombre:", filtered); // Mostrar los resultados filtrados en la consola
                if (filtered.length === 0) {
                  alert("No se encontraron resultados para el nombre ingresado.");
                }
                setFilteredResults(filtered); // Actualiza los resultados filtrados
              }}
            >
              Filtrar
            </button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Resultados
                </th>
              </tr>
            </thead>
          </table>
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
              {filteredResults.map((licitacion, index) => (
                <tr key={index}>
                  <td>{licitacion.Nombre}</td>
                  <td>{estados[licitacion.CodigoEstado] || "Estado desconocido"}</td>
                  <td>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Navegando with CodigoExterno:", licitacion.CodigoExterno); // Depuración del evento
                        setSelectedCodigoExterno(licitacion.CodigoExterno); // Establece el estado para mostrar DetalleLicitacion
                      }}
                      className="btn btn-link"
                    >
                      {licitacion.CodigoExterno}
                    </a>
                  </td>
                  <td>{licitacion.FechaCierre ? new Date(licitacion.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                placeholder="Ejemplo: 1019-74-LE25"
                value={codigoFiltro} // Ahora funciona correctamente como cadena
                onChange={(e) => {
                  const value = e.target.value;
                  if (!validateCode(value)) {
                    alert("Código no válido. Solo se permiten letras, números y guiones.");
                    return;
                  }
                  setCodigoFiltro(value);
                }}
              />
            </div>
          </div>
          <div className="text-center mb-4">
            <button className="btn btn-primary" onClick={handleFilterByCode}>Buscar por Código</button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Resultados
                </th>
              </tr>
            </thead>
          </table>
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
              {filteredResults.map((licitacion, index) => (
                <tr key={index}>
                  <td>{licitacion.Nombre}</td>
                  <td>{estados[licitacion.CodigoEstado] || "Estado desconocido"}</td>
                  <td>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Navegando with CodigoExterno:", licitacion.CodigoExterno); // Depuración del evento
                        setSelectedCodigoExterno(licitacion.CodigoExterno); // Establece el estado para mostrar DetalleLicitacion
                      }}
                      className="btn btn-link"
                    >
                      {licitacion.CodigoExterno}
                    </a>
                  </td>
                  <td>{licitacion.FechaCierre ? new Date(licitacion.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  const value = e.target.value;
                  if (!validateDate(value)) {
                    alert("Fecha no válida. No se permiten fechas futuras.");
                    return;
                  }
                  setCodigoFiltro(value);
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
                  if (!codigoFiltro) {
                    console.error("La fecha no está definida. Por favor, ingrese una fecha válida.");
                    return;
                  }

                  // Formatear la fecha a DDMMYYYY
                  const formattedDate = codigoFiltro.split('-').reverse().join('');
                  console.log("Fecha formateada:", formattedDate); // Mostrar la fecha formateada en la consola

                  const apiUrl = `${API_BASE}fecha=${formattedDate}&ticket=${API_TICKET}`;
                  console.log("URL formada:", apiUrl); // Mostrar la URL formada en la consola

                  const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    },
                  });

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
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Resultados
                </th>
              </tr>
            </thead>
          </table>
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
              {filteredResults.map((licitacion, index) => (
                <tr key={index}>
                  <td>{licitacion.Nombre}</td>
                  <td>{estados[licitacion.CodigoEstado] || "Estado desconocido"}</td>
                  <td>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Navegando with CodigoExterno:", licitacion.CodigoExterno); // Depuración del evento
                        setSelectedCodigoExterno(licitacion.CodigoExterno); // Establece el estado para mostrar DetalleLicitacion
                      }}
                      className="btn btn-link"
                    >
                      {licitacion.CodigoExterno}
                    </a>
                  </td>
                  <td>{licitacion.FechaCierre ? new Date(licitacion.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="tab-pane fade"
          id="buscar-estado"
          role="tabpanel"
          aria-labelledby="buscar-estado-tab"
        >
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="estadoFiltro" className="form-label">Seleccione Estado</label>
              <select
                id="estadoFiltro"
                className="form-select"
                onChange={(e) => {
                  const estadoSeleccionado = e.target.value;
                  if (!estadoSeleccionado) {
                    alert("Por favor, seleccione un estado válido.");
                    setFilteredResults([]); // Limpia los resultados si no se selecciona un estado
                    return;
                  }
                  console.log("Estado seleccionado:", estadoSeleccionado); // Mostrar el estado seleccionado en la consola
                  const estadoNombre = estados[estadoSeleccionado] || "Estado desconocido";
                  const apiUrl = `${API_BASE}estado=${estadoNombre}&ticket=${API_TICKET}`;
                  console.log("URL formada:", apiUrl); // Mostrar la URL formada en la consola
                  //alert(`Estado seleccionado: ${estadoNombre}\nURL formada: ${apiUrl}`); // Mostrar el estado y la URL en pantalla

                  const filtered = dataServices.filter(
                    (licitacion) => licitacion.CodigoEstado.toString() === estadoSeleccionado
                  );
                  if (filtered.length === 0) {
                    alert("No se encontraron resultados para el estado seleccionado.");
                  }
                  setFilteredResults(filtered); // Actualiza los resultados filtrados
                }}
              >
                <option value="">Seleccione un estado</option>
                {Object.entries(estados).map(([codigo, nombre]) => (
                  <option key={codigo} value={codigo}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Resultados
                </th>
              </tr>
            </thead>
          </table>
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
              {filteredResults.map((licitacion, index) => (
                <tr key={index}>
                  <td>{licitacion.Nombre}</td>
                  <td>{estados[licitacion.CodigoEstado] || "Estado desconocido"}</td>
                  <td>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Navegando with CodigoExterno:", licitacion.CodigoExterno); // Depuración del evento
                        setSelectedCodigoExterno(licitacion.CodigoExterno); // Establece el estado para mostrar DetalleLicitacion
                      }}
                      className="btn btn-link"
                    >
                      {licitacion.CodigoExterno}
                    </a>
                  </td>
                  <td>{licitacion.FechaCierre ? new Date(licitacion.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="tab-pane fade"
          id="buscar-fecha-estado"
          role="tabpanel"
          aria-labelledby="buscar-fecha-estado-tab"
        >
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="fechaFiltroEstado" className="form-label">Ingrese la Fecha</label>
              <input
                type="date"
                id="fechaFiltroEstado"
                className="form-control"
                max={new Date().toISOString().split('T')[0]} // Deshabilitar fechas posteriores a la fecha actual
                onChange={(e) => {
                  const value = e.target.value;
                  console.log("Fecha ingresada:", value); // Mostrar la fecha ingresada en la consola
                  if (!validateDate(value)) {
                    alert("Fecha no válida. No se permiten fechas futuras.");
                    return;
                  }
                  setCodigoFiltro((prev) => ({ ...prev, fecha: value })); // Actualiza la propiedad fecha del estado
                }}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="estadoFiltroFecha" className="form-label">Seleccione Estado</label>
              <select
                id="estadoFiltroFecha"
                className="form-select"
                onChange={(e) => {
                  const estadoSeleccionado = e.target.value;
                  console.log("Estado seleccionado:", estadoSeleccionado); // Mostrar el estado seleccionado en la consola
                  setCodigoFiltro((prev) => ({ ...prev, estado: estadoSeleccionado })); // Actualiza la propiedad estado del estado
                }}
              >
                <option value="">Seleccione un estado</option>
                {Object.entries(estados).map(([codigo, nombre]) => (
                  <option key={codigo} value={codigo}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-center mb-4">
            <button
              className="btn btn-primary"
              onClick={async () => {
                const { fecha, estado } = codigoFiltro;
                console.log("Datos ingresados:", { fecha, estado }); // Mostrar los datos ingresados en la consola
                if (!fecha || !estado) {
                  alert("Por favor, ingrese una fecha y seleccione un estado.");
                  return;
                }

                try {
                  const formattedDate = fecha
                    .split('-')
                    .reverse()
                    .map((part) => part.padStart(2, '0')) // Asegura que día y mes tengan dos dígitos
                    .join('');
                  const estadoNombre = estados[estado] || "Estado desconocido"; // Obtener el nombre del estado
                  const apiUrl = `${API_BASE}fecha=${formattedDate}&estado=${estadoNombre}&ticket=${API_TICKET}`;
                  console.log("URL formada:", apiUrl); // Mostrar la URL formada en la consola

                  const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    },
                  });

                  if (!response.ok) {
                    throw new Error(`Error al consumir la API: ${response.status} ${response.statusText}`);
                  }

                  const data = await response.json();
                  console.log("Resultado JSON obtenido:", JSON.stringify(data, null, 2)); // Mostrar el resultado JSON en la consola

                  if (data.Listado && Array.isArray(data.Listado)) {
                    setFilteredResults(data.Listado); // Actualizar los resultados filtrados
                  } else {
                    alert("No se encontraron resultados para los criterios seleccionados.");
                    setFilteredResults([]); // Limpiar resultados si no hay datos
                  }
                } catch (error) {
                  console.error("Error al consumir la API:", error);
                  alert("Hubo un error al obtener los datos. Por favor, inténtelo nuevamente.");
                }
              }}
            >
              Filtrar por Fecha y Estado
            </button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Resultados
                </th>
              </tr>
            </thead>
          </table>
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
              {filteredResults.map((licitacion, index) => (
                <tr key={index}>
                  <td>{licitacion.Nombre}</td>
                  <td>{estados[licitacion.CodigoEstado] || "Estado desconocido"}</td>
                  <td>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Navegando with CodigoExterno:", licitacion.CodigoExterno); // Depuración del evento
                        setSelectedCodigoExterno(licitacion.CodigoExterno); // Establece el estado para mostrar DetalleLicitacion
                      }}
                      className="btn btn-link"
                    >
                      {licitacion.CodigoExterno}
                    </a>
                  </td>
                  <td>{licitacion.FechaCierre ? new Date(licitacion.FechaCierre).toLocaleDateString() : "Fecha no disponible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          {renderPagination()}
        </ul>
      </nav>
    </div>
  );
}

export default Licitaciones;
