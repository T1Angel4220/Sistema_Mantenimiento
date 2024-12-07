import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'


const endpoint = 'http://localhost:8000/api'
const MostrarEquipos = () => {
    const [equipos,setEquipos] = useState([])
    useEffect (()=>{
        getAllEquipos()
    },[])

    const getAllEquipos = async () => {
        const response = await axios.get(`${endpoint}/equipos`)
        setEquipos(response)
    }

    const deleteEquipo = async (id) => {
        await axios.delete(`${endpoint}/product/${id}`)
        getAllEquipos()
    }
  return (
    <div>
        <div className='d-grid gap-2'>
            <Link to="/create" className='btn btn-success btn-lg mt-2 mb-2  text-white'>Crear</Link>
        </div>

        <table className='table table-striped'>
            <thead>
                <tr>
                    <th>Nombre del producto</th>
                    <th>Tipo_Equipo</th>
                    <th>Fecha Adquisión</th>
                    <th>Ubicación del Equipo</th>
                    <th>Descripción del Equipo</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {equipos.map( (equipo) =>(
                    <tr key= {equipo.id}>
                        <td>{equipo.Nombre_Producto}</td>
                        <td>{equipo.Tipo_Equipo}</td>
                        <td>{equipo.Fecha_Adquisicion}</td>
                        <td>{equipo.Ubicacion_Equipo}</td>
                        <td>{equipo.Descripcion_Equipo}</td>
                        <td>
                            <Link to={`/edit/${equipo.id}`} className='btn btn-warning'>Editar</Link>
                            <button onClick={()=>deleteEquipo(equipo.id)} className='btn btn-danger'>Eliminar</button>
                        </td>
                        
                    </tr>
                ))}
            </tbody>

        </table>

    </div>
  )
}

export default MostrarEquipos