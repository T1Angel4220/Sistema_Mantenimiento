import React, { useEffect } from 'react';
import './Notification.css'; // Asegúrate de que este archivo esté bien enlazado

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Cerrar la notificación después de 3 segundos

            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    // Definir íconos según el tipo de mensaje
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <i className="fas fa-check-circle icon"></i>; // Ícono de éxito
            case 'error':
                return <i className="fas fa-times-circle icon"></i>; // Ícono de error
            case 'warning':
                return <i className="fas fa-exclamation-circle icon"></i>; // Ícono de advertencia
            case 'info':
                return <i className="fas fa-info-circle icon"></i>; // Ícono de información
            default:
                return <i className="fas fa-info-circle icon"></i>; // Ícono por defecto
        }
    };

    return (
        message && (
            <div className={`notification ${type} ${message ? 'show' : ''}`}>
                {getIcon()}
                <p>{message}</p>
            </div>
        )
    );
};

export default Notification;
