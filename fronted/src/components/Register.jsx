import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importar axios

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

            // Si la respuesta es exitosa, muestra un mensaje y redirige al login
            console.log(response.data);
            alert('Usuario registrado exitosamente');
            navigate('/'); // Redirige al login después del registro
        } catch (error) {
            // Manejar cualquier error, como errores de validación o de servidor
            if (error.response) {
                // Si el error viene del backend
                console.error(error.response.data);
                alert('Error: ' + error.response.data.message);
            } else {
                console.error(error);
                alert('Error en la conexión al servidor');
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <div className="register-header">
                    <h2>Crear Cuenta</h2>
                    <p>Complete la información para registrarse.</p>
                </div>
                <form onSubmit={handleSubmit}>
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
                        Volver al Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
