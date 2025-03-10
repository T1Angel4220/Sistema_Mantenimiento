import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';  // Asegúrate de importar el componente Inicio
import MostrarEquipos from './components/MostrarEquipos';
import CrearEquipos from './components/CrearEquipos';
import EditarEquipo from './components/EditarEquipo';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/Main" element={<Main />} />  {/* Ruta para la página de inicio */}
                <Route path="/equipos" element={<MostrarEquipos/>}/>
                <Route path="/create" element={<CrearEquipos />} /> 
                <Route path="/edit/:id" element={<EditarEquipo />} />





            </Routes>
        </Router>
    );
}

export default App;
