import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from './Notification';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario ya está autenticado
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/main'); // Redirigir a la página principal si hay un token
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            email: correo,
            password: contraseña,
        };

        try {
            const response = await axios.post('http://localhost:8000/api/login', loginData);

            localStorage.setItem('token', response.data.token);

            setSuccessMessage('Inicio de sesión exitoso');
            setTimeout(() => {
                navigate('/main');
            }, 2000);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || 'Error en el servidor');
            } else {
                setError('Error en la conexión al servidor');
            }
        }
    };

    return (
        <div className="bodylogin">
            <div className="login-container">
                {error && <Notification message={error} type="error" onClose={() => setError('')} />}
                {successMessage && <Notification message={successMessage} type="success" onClose={() => setSuccessMessage('')} />}

                <div className="login-box">
                    <div className="login-icon">
                        <img 
                            src="https://w7.pngwing.com/pngs/653/121/png-transparent-preventive-maintenance-company-service-reliability-centered-maintenance-others-thumbnail.png" 
                            alt="Icono de usuario" 
                            className="icon-image" 
                        />
                    </div>
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
