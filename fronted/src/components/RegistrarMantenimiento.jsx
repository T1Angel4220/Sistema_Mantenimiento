import React, { useState } from 'react';
import MantenimientoInterno from './MantenimientoInterno';
import MantenimientoExterno from './MantenimientoExterno';
import './RegistrarMantenimiento.css';

const RegistrarMantenimiento = ({ onClose }) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');

  return (
    <div className="modal-container">
      <h2 className="modal-title">Registrar Mantenimiento</h2>
      <form>
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={opcionSeleccionada === 'interno'}
              onChange={() =>
                setOpcionSeleccionada(opcionSeleccionada === 'interno' ? '' : 'interno')
              }
            />
            Mantenimiento Interno
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={opcionSeleccionada === 'externo'}
              onChange={() =>
                setOpcionSeleccionada(opcionSeleccionada === 'externo' ? '' : 'externo')
              }
            />
            Mantenimiento Externo
          </label>
        </div>

        {opcionSeleccionada === 'interno' && <MantenimientoInterno />}
        {opcionSeleccionada === 'externo' && <MantenimientoExterno />}

        <button type="button" onClick={onClose} className="btn-close">
          Cerrar
        </button>
      </form>
    </div>
  );
};

export default RegistrarMantenimiento;
