        import { validateRUT } from '../utils/validations';

function BusquedaProveedor() {
  const [rut, setRut] = useState('');

  return (
    <div className="container mt-5">
      {/* ...existing code... */}
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="rutInput" className="form-label">Ingrese RUT</label>
          <input
            type="text"
            id="rutInput"
            className="form-control"
            placeholder="Ejemplo: 10.187.606-3"
            value={rut}
            onChange={(e) => {
              const value = e.target.value;
              if (!validateRUT(value)) {
                alert("RUT no válido. Debe tener el formato XX.XXX.XXX-Y, donde Y puede ser un número o la letra K.");
                return;
              }
              setRut(value);
            }}
          />
        </div>
      </div>
      {/* ...existing code... */}
    </div>
  );
}

export default BusquedaProveedor;