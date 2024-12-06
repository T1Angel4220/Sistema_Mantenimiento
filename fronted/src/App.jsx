import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';  // Asegúrate de importar el componente Inicio

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/Main" element={<Main />} />  {/* Ruta para la página de inicio */}

            </Routes>
        </Router>
    );
}

export default App;
