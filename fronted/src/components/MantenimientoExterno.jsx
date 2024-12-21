import React from 'react';

const MantenimientoExterno = () => {
    return (
        <form className="crear-equipos-form">
            <div className="crear-equipos-form-group">
                <label className="crear-equipos-label">Nombre del Equipo:</label>
                <input type="text" className="crear-equipos-input" placeholder="Ingrese el nombre del equipo" />
            </div>
            <div className="crear-equipos-form-group">
                <label className="crear-equipos-label">Empresa Externa:</label>
                <input type="text" className="crear-equipos-input" placeholder="Ingrese el nombre de la empresa" />
            </div>
            <div className="crear-equipos-form-group">
                <label className="crear-equipos-label">Detalles del Mantenimiento:</label>
                <textarea className="crear-equipos-textarea" placeholder="Ingrese los detalles del mantenimiento"></textarea>
            </div>
            <div className="crear-equipos-form-group">
                <label className="crear-equipos-label">Fecha del Mantenimiento:</label>
                <input type="date" className="crear-equipos-input" />
            </div>
            <button type="submit" className="crear-equipos-submit-btn">Registrar Mantenimiento Externo</button>
        </form>
    );
};

export default MantenimientoExterno;
