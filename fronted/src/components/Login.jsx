import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from './Notification'; // Asegúrate de que Notification esté importado correctamente

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');  // Manejo de errores
    const [successMessage, setSuccessMessage] = useState(''); // Para mensajes de éxito
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear el objeto con los datos del formulario
        const loginData = {
            email: correo,
            password: contraseña,
        };

        try {
            // Enviar los datos de login al backend
            const response = await axios.post('http://localhost:8000/api/login', loginData);

            // Almacenar el token JWT (si la autenticación es exitosa)
            localStorage.setItem('token', response.data.token);  // Guarda el token en el almacenamiento local

            // Mostrar el mensaje de éxito
            setSuccessMessage('Inicio de sesión exitoso');
            setTimeout(() => {
                navigate('/main'); // Redirigir a la página principal
            }, 2000); // Espera 2 segundos antes de redirigir

        } catch (error) {
            // Manejar errores
            if (error.response) {
                // Si el error es del backend, muestra un mensaje más amigable
                setError(error.response.data.error || 'Error en el servidor');
            } else {
                setError('Error en la conexión al servidor');
            }
        }
    };

    return (
        <div className="bodylogin">
            <div className="login-container">
                {/* Mostrar notificación de error si existe */}
                {error && <Notification message={error} type="error" onClose={() => setError('')} />}
                {/* Mostrar mensaje de éxito */}
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
                        <button
                            type="button"
                            className="form-button secondary-button"
                            onClick={() => navigate('/register')}
                        >
                        Registrarse
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
