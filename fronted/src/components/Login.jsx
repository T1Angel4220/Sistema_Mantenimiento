import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Procesar login aquí
        console.log({ correo, contraseña });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-icon">👤</div>
                <h2 className="login-title">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            placeholder="Ingrese su correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="contraseña">Contraseña</label>
                        <input
                            type="password"
                            id="contraseña"
                            placeholder="Ingrese su contraseña"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="form-button">
                        Iniciar Sesión
                    </button>
                    <button
                        type="button"
                        className="form-button secondary-button"
                        onClick={() => navigate('/register')}
                    >
                        Registrarse
                    </button>
                </form>
                <div className="login-links">
                    <a href="#">¿Olvidó su contraseña?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;