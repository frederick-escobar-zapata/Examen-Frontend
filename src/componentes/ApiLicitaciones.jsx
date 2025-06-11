import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DetalleLicitacion from './DetalleLicitacion'; // Importar el componente DetalleLicitacion

const API_SERVICES = 'https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json?ticket=AC3A098B-4CD0-41AF-81A5-41284248419B';

function ApiLicitaciones(){
    
    const [dataServices, setDataServices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [cantidad, setCantidad] = useState(0); // Estado para almacenar la cantidad
    const [anioCreacion, setAnioCreacion] = useState(''); // Estado para almacenar el año de creación
    const [selectedCodigoExterno, setSelectedCodigoExterno] = useState(null); // Estado para el Código Externo seleccionado

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
                console.log("Estado de la respuesta:", responseServices.status); // Depuración del estado HTTP
                if (responseServices.status === 500) {
                    console.warn("Error 500 detectado. Respuesta omitida."); // Mostrar omisión por consola
                    return;
                }
                if (!responseServices.ok) {
                    throw new Error(`Error al obtener los datos: ${responseServices.status} ${responseServices.statusText}`);
                }
                const dataServices = await responseServices.json();
                console.log("Respuesta de la API:", dataServices); // Mostrar respuesta de la API en la consola

                // Validar estructura de la respuesta
                if (!dataServices || typeof dataServices !== 'object') {
                    throw new Error("La respuesta de la API no tiene el formato esperado.");
                }
                if (!dataServices.Listado || !Array.isArray(dataServices.Listado)) {
                    throw new Error("La respuesta de la API no contiene un listado válido.");
                }
                if (!dataServices.Cantidad || !dataServices.FechaCreacion) {
                    throw new Error("Faltan datos importantes en la respuesta de la API.");
                }

                // Asignar datos al estado
                setCantidad(dataServices.Cantidad || 0); // Capturar la cantidad
                setAnioCreacion(new Date(dataServices.FechaCreacion).toLocaleDateString()); // Capturar la fecha completa (día, mes y año)
                setDataServices(dataServices.Listado);
            } catch (error) {
                console.error("Error al procesar la respuesta de la API:", error); // Depuración de errores
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }
    , []);
    if (loading) {
            return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        ); // Mostrar spinner de carga
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center" role="alert" style={{ fontSize: '1.2rem', padding: '15px' }}>
                <p>¡Ups! Algo salió mal mientras cargábamos los datos.</p>
                <p>Por favor, inténtalo nuevamente más tarde.</p>       
            </div>
        ); // Mostrar mensaje de error amistoso
    }

    if (!dataServices || dataServices.length === 0) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                No hay datos disponibles para mostrar.
            </div>
        ); // Mostrar mensaje si no hay datos
    }

    const totalPages = Math.ceil(dataServices.length / 10);
    const currentItems = dataServices.slice((currentPage - 1) * 10, currentPage * 10);

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

    if (selectedCodigoExterno) {
        return (
            <DetalleLicitacion
                codigoExterno={selectedCodigoExterno}
                onBack={() => setSelectedCodigoExterno(null)} // Función para volver al listado
            />
        );
    }

    return (
        <div className="container" style={{ maxWidth: '100%' }}>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th colSpan="4" style={{ backgroundColor: '#343a40', color: '#ffffff', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Listado de Licitaciones - {cantidad} - Fecha: {anioCreacion}
                        </th>
                    </tr>
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
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => setSelectedCodigoExterno(licitacion.CodigoExterno)}
                                >
                                    {licitacion.CodigoExterno}
                                </button>
                            </td>
                            <td>{licitacion.Nombre}</td>
                            <td>{licitacion.CodigoEstado}</td>
                            <td>{new Date(licitacion.FechaCierre).toLocaleString()}</td>
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

export default ApiLicitaciones;