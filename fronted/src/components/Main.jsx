import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';

const Main = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, redirige al login
            navigate('/'); // Redirige al login
        }
    }, [navigate]);

    const handleLogout = () => {
        // Muestra el mensaje de confirmación
        const confirmLogout = window.confirm("¿Está seguro de que desea cerrar sesión?");
        if (confirmLogout) {
            // Si confirma, elimina el token y redirige al login
            localStorage.removeItem('token');
            navigate('/'); // Redirige al login
        }
    };

    return (
        <div className="main-container">
            <div className="main-sidebar">
                <div className="main-sidebar-header">
                    <h2 className="main-sidebar-title">T1</h2>
                </div>
                <button className="main-sidebar-btn" onClick={() => navigate('/equipos')}>Equipos</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/mantenimientos')}>Mantenimientos</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/reportes')}>Reportes</button>
                <button className="main-logout-btn" onClick={handleLogout}>Salir</button>
            </div>

            <div className="main-content">
                <div className="main-header">
                    <h1 className="main-header-title">Bienvenido al Sistema</h1>
                </div>
                <div className="main-cards">
                    <div className="main-card">
                        <h2 className="main-card-title">Estadísticas</h2>
                        <p className="main-card-text">Resumen de datos importantes</p>
                    </div>

                    <div className="main-card">
                        <h2 className="main-card-title">Últimos Registros</h2>
                        <p className="main-card-text">Vista rápida de los últimos movimientos</p>
                    </div>
                </div>

                <div className="main-table-container">
                    <table className="main-table">
                        <thead>
                            <tr>
                                <th className="main-th">Nombre del Equipo</th>
                                <th className="main-th">Tipo</th>
                                <th className="main-th">Ubicación</th>
                                <th className="main-th">Estado</th>
                                <th className="main-th">Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="main-td">PC</td>
                                <td className="main-td">INFORMATICO</td>
                                <td className="main-td">LAB REDES</td>
                                <td className="main-td">MANTENIMIENTO</td>
                                <td className="main-td">01/01/2024</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Main;
