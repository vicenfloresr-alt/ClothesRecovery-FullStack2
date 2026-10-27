import { regiones, comunas } from '../data/zonas';

function DireccionFields({ valores, onCambiar }) {
  const comunasDisponibles = [];
  for (let i = 0; i < comunas.length; i++) {
    if (comunas[i].id_region === Number(valores.region)) {
      comunasDisponibles.push(comunas[i]);
    }
  }

  function manejarCambio(evento) {
    onCambiar(evento.target.name, evento.target.value);
  }

  function manejarCambioRegion(evento) {
    onCambiar('region', evento.target.value);
    onCambiar('comuna', '');
  }

  return (
    <div className="row">
      <div className="col-md-6 form-grupo mb-3">
        <label htmlFor="calle" className="form-label">Calle <span className="opcional">obligatorio</span></label>
        <input type="text" className="form-control" id="calle" name="calle" value={valores.calle} onChange={manejarCambio} required />
      </div>
      <div className="col-md-6 form-grupo mb-3">
        <label htmlFor="departamento" className="form-label">Departamento <span className="opcional">opcional</span></label>
        <input type="text" className="form-control" id="departamento" name="departamento" placeholder="ej: 603" value={valores.departamento} onChange={manejarCambio} />
      </div>
      <div className="col-md-6 form-grupo mb-3">
        <label htmlFor="region" className="form-label">Región <span className="opcional">obligatorio</span></label>
        <select className="form-select" id="region" name="region" value={valores.region} onChange={manejarCambioRegion} required>
          <option value="" disabled>Selecciona una región</option>
          {regiones.map((region) => (
            <option key={region.id} value={region.id}>{region.nombre}</option>
          ))}
        </select>
      </div>
      <div className="col-md-6 form-grupo mb-3">
        <label htmlFor="comuna" className="form-label">Comuna <span className="opcional">obligatorio</span></label>
        <select className="form-select" id="comuna" name="comuna" value={valores.comuna} onChange={manejarCambio} required disabled={!valores.region}>
          <option value="" disabled>Selecciona una comuna</option>
          {comunasDisponibles.map((comuna) => (
            <option key={comuna.id} value={comuna.id}>{comuna.nombre}</option>
          ))}
        </select>
      </div>
      <div className="form-grupo mb-3">
        <label htmlFor="indicaciones" className="form-label">Indicaciones para la entrega <span className="opcional">opcional</span></label>
        <textarea className="form-control" id="indicaciones" name="indicaciones" rows="3" placeholder="Ej.: Entre calles, color del edificio, no tiene timbre." value={valores.indicaciones} onChange={manejarCambio}></textarea>
      </div>
    </div>
  );
}

export default DireccionFields;
