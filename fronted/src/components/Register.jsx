import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Importar axios
import Notification from './Notification'; // Asegúrate de que Notification esté importado correctamente

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // Manejo de errores
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Crear el objeto con los datos del formulario
        const userData = {
            name: firstName,        // Cambié 'first_name' por 'name'
            lastname: lastName,     // Cambié 'last_name' por 'lastname'
            email: email,
            password: password,
            password_confirmation: password, // Para confirmar la contraseña en el backend
        };

        try {
            // Enviar la solicitud POST al backend
            const response = await axios.post('http://localhost:8000/api/register', userData);

            // Si la respuesta es exitosa, muestra un mensaje de éxito
            setSuccessMessage('¡Usuario registrado exitosamente!');
            setTimeout(() => {
                navigate('/'); // Redirige al login después de 2 segundos
            }, 2000);

        } catch (error) {
            // Manejar cualquier error, como errores de validación o de servidor
            if (error.response) {
                // Si el error viene del backend
                setError(error.response.data.message || 'Error al registrar el usuario');
            } else {
                setError('Error en la conexión al servidor');
            }
        }
    };

    return (
        <div className="bodyregister">
            <div className="register-container">
                <div className="register-box">
                    <div className="register-header">
                        <h2>Crear Cuenta</h2>
                        <p>Complete la información para registrarse.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* Mostrar notificación de error si existe */}
                        {error && <Notification message={error} type="error" onClose={() => setError('')} />}
                        {/* Mostrar mensaje de éxito si existe */}
                        {successMessage && <Notification message={successMessage} type="success" onClose={() => setSuccessMessage('')} />}
    
                        <div className="input-group">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Escriba su nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Apellido</label>
                            <input
                                type="text"
                                placeholder="Escriba su apellido"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                placeholder="Escriba su correo"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Escriba su contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="form-button primary-button">
                            Registrarse
                        </button>
                        <button
                            type="button"
                            className="form-button secondary-button"
                            onClick={() => navigate('/')}
                        >
                            Volver atras
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}    
export default Register;
