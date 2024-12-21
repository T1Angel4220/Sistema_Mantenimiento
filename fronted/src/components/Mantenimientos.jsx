
import React, { useState } from 'react';
import './CrearEquipos.css';
import MantenimientoInterno from './MantenimientoInterno';
import MantenimientoExterno from './MantenimientoExterno';

const endpoint = 'http://localhost:8000/api/equipo';



const Mantenimientos = () => {
    const [tipoMantenimiento, setTipoMantenimiento] = useState('interno');

    const handleTipoMantenimientoChange = (event) => {
        setTipoMantenimiento(event.target.value);
    };

    return (
        <div className="crear-equipos-container">
            <h1 className="crear-equipos-title">Registrar Mantenimiento</h1>
            <div className="crear-equipos-form">
                <div className="crear-equipos-form-group">
                    <label className="crear-equipos-label">Tipo de Mantenimiento:</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                value="interno"
                                checked={tipoMantenimiento === 'interno'}
                                onChange={handleTipoMantenimientoChange}
                            />
                            Interno
                        </label>
                        <label style={{ marginLeft: '20px' }}>
                            <input
                                type="radio"
                                value="externo"
                                checked={tipoMantenimiento === 'externo'}
                                onChange={handleTipoMantenimientoChange}
                            />
                            Externo
                        </label>
                    </div>
                </div>

                {tipoMantenimiento === 'interno' ? (
                    <MantenimientoInterno />
                ) : (
                    <MantenimientoExterno />
                )}
            </div>
        </div>
    );
};

export default Mantenimientos;