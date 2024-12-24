import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa axios para hacer la solicitud HTTP

import 'react-datepicker/dist/react-datepicker.css';

export default function AssetMaintenanceForm() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [showComponents, setShowComponents] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('Interno'); // Estado para tipo de mantenimiento
  const [provider, setProvider] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);
  const [contact, setContact] = useState('');
  const [cost, setCost] = useState('');
  const [observations, setObservations] = useState(''); // Observaciones
  const [showProveedorButtons, setShowProveedorButtons] = useState(false); // Estado para mostrar botones de proveedores
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]); // Estado para los activos cargados desde la API
  const [components, setComponents] = useState([]); // Estado para los activos cargados desde la API
  const [activities, setActivities] = useState([]);
  const [idMaximo, setIdMaximo] = useState(null);
  const today = new Date();
  useEffect(() => {
    axios.get('http://localhost:8000/api/mantenimientos_idMax')
      .then(response => {
        setIdMaximo(response.data+1);
      })
      .catch(() => {
        setIdMaximo(1);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault() 
    
    const actividades=selectedActivities.map( item=>item.id);
    const tipo=maintenanceType.charAt(0).toUpperCase() + maintenanceType.slice(1).toLowerCase();
    const mantenimientoData = {
      codigo_mantenimiento: "MANT_"+idMaximo, // Puedes adaptarlo según sea necesario
      tipo: tipo,
      fecha_inicio: startDate,
      fecha_fin: endDate,
      proveedor: provider,
      contacto_proveedor: contact,
      costo: parseFloat(cost),
      observaciones: observations,
      actividades: actividades, // Aquí seleccionas las actividades
    };
    console.log(mantenimientoData);
    try {
      const response = await axios.post('http://localhost:8000/api/mantenimientos', mantenimientoData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/InicioMantenimientos')
      console.log('Mantenimiento creado:', response.data);
      // Redirigir o realizar cualquier acción adicional después de la respuesta
    } catch (error) {
      console.error('Error al crear el mantenimiento:', error);
    }
  };
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/actividades');
        setActivities(response.data); 
        console.log(response.data);
      } catch (error) {
        console.error("Error al cargar las actividades", error);
      }
    };

    fetchAssets();
  }, []);
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipos');
        setAssets(response.data); // Suponiendo que los activos vienen en response.data
      } catch (error) {
        console.error("Error al cargar los activos:", error);
      }
    };

    fetchAssets();
  }, []); // El efect
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/componentes');
        setComponents(response.data);
         // Suponiendo que los activos vienen en response.data
      } catch (error) {
        console.error("Error al cargar los componentes:", error);
      }
    };

    fetchAssets();
  }, []); // Elefect
  const handleAddActivity = (e) => {
    const nombre= e.target.value;
    console.log(selectedActivities);
    const idEncontrado = activities.find((objeto) => objeto.nombre === nombre).id;
    
    const selected= {"id":idEncontrado,"nombre":nombre };
    const existe = selectedActivities.some(activity => activity.id === idEncontrado);

    if (selected && !existe) {
      setSelectedActivities([...selectedActivities, selected]);
    }
    e.target.value = ''; // Reinicia el valor del select
  };

  const handleRemoveActivity = (activity) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const handleSelectAsset = (e) => {
    setSelectedAsset(e.target.value); // Actualiza el activo seleccionado
  };

  const handleAddComponent = (e) => {
    const selected = e.target.value;
    if (selected && !selectedComponents.includes(selected)) {
      setSelectedComponents([...selectedComponents, selected]);
    }
    e.target.value = ''; // Reinicia el valor del select
  };

  const handleRemoveComponent = (component) => {
    setSelectedComponents(selectedComponents.filter((c) => c !== component));
  };

  return (
    <div className="main-container flex flex-col items-center bg-gray-100 min-h-screen">
      <div className="max-w-4xl w-full p-6 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Mantenimiento de Equipos</h1>

        <div className="space-y-6">
          <div>
            <p className="mb-4 text-center">
              ¿El mantenimiento se realizará dentro de la institución (interno) o será externo?
            </p>
            <div className="flex justify-center items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="maintenance-type"
                  value="Interno"
                  checked={maintenanceType === 'Interno'}
                  onChange={() => {
                    setMaintenanceType('Interno');
                    // Resetea los campos de "externo"
                    setProvider('');
                    setEstimatedDeliveryDate(null);
                    setContact('');
                    setCost('');
                    // Resetea los campos generales
                    setSelectedActivities([]); // Resetea las actividades
                    setSelectedComponents([]); // Resetea los componentes seleccionados
                    setSelectedAsset(''); // Resetea el activo seleccionado
                    setObservations(''); // Resetea el campo de observaciones
                    setStartDate(null); // Opcionalmente, resetea la fecha de inicio para consistencia
                    setEndDate(null); // Opcionalmente, resetea la fecha de fin para consistencia
                  }}
                  className="mr-2 accent-black"
                />
                Interno
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="maintenance-type"
                  value="Externo"
                  checked={maintenanceType === 'Externo'}
                  onChange={() => {
                    setMaintenanceType('Externo');
                    // Resetea los campos de "interno"
                    setStartDate(null);
                    setEndDate(null);
                    // Resetea los campos generales
                    setSelectedActivities([]); // Resetea las actividades
                    setSelectedComponents([]); // Resetea los componentes seleccionados
                    setSelectedAsset(''); // Resetea el activo seleccionado
                    setObservations(''); // Resetea el campo de observaciones
                    setProvider(''); // Limpia el proveedor
                    setEstimatedDeliveryDate(null); // Limpia la fecha estimada de entrega
                    setContact(''); // Limpia el contacto del mantenimiento
                    setCost(''); // Limpia el costo del mantenimiento
                  }}
                  className="mr-2 accent-black"
                />
                Externo
              </label>

            </div>
          </div>
          <label
              type="text"
              className="max-w-[200px]  p-2"
            >Codigo de Mantenimiento: MANT_{idMaximo} </label>
             <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label>Fecha de Inicio:</label>
              <br />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date.toISOString().split('T')[0])}
                locale={es}
                dateFormat="dd/MM/yyyy"
                minDate={today}
                customInput={
                  <button 
                  type="button"
                  className="border border-black p-2 flex items-center text-black w-64">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    {startDate ? format(startDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}
                  </button>
                }
               
              />
              
            </div>

            <div className="space-y-2">
              <label>Fecha Estimada de Fin:</label>
              <br />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date.toISOString().split('T')[0])}
                locale={es}
                dateFormat="dd/MM/yyyy"
                minDate= {startDate}
                customInput={
                  <button 
                  type="button"
                  
                  className="border border-black p-2 flex items-center text-black w-64">
                    <Calendar requiredFeatures className="mr-2 h-4 w-4 text-black" />
                    {endDate ? format(endDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}
                  </button>
                }
              />
            </div>
          </div>
          <div>
           
          </div>
          {maintenanceType === 'Externo' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="proveedor">Proveedor:</label>
                <input
                  id="proveedor"
                  maxlength="25"
                  className="border-2 border-black p-2 w-full"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  required
                />
              </div>

              

              <div className="space-y-2">
                <label htmlFor="contacto">Contacto del Mantenimiento:</label>
                <input
                 required
                  id="contacto"
                  maxlength="25"
                  className="border-2 border-black p-2 w-full"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="costo">Costo del Mantenimiento:</label>
                <input
                  required
                  id="costo"
                  className="border-2 border-black p-2 w-full"
                  type="number"
                   min="100" 
                   max="100000"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>
          )}

          

          {/* Modificación de la sección de activos */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="font-medium">Seleccione los equipos que tendrá el mantenimiento:</p>
              <select
                onChange={handleSelectAsset}
                className="border-2 border-black p-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione un equipo por su codigo de barras
                </option>
                {assets.map((asset) => (
                  <option key={asset.Codigo_Barras} value={asset.id}>
                    {asset.Codigo_Barras}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p>¿Se agregaron o cambiaron componentes?</p>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="components-changed"
                      value="si"
                      className="accent-black"
                      onChange={() => setShowComponents(true)}
                    />{' '}
                    Sí
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="components-changed"
                      value="no"
                      className="accent-black"
                      onChange={() => setShowComponents(false)}
                    />{' '}
                    No
                  </label>
                </div>
              </div>

              {showComponents && (
                <div className="space-y-2 mt-4">
                  <select
                    onChange={handleAddComponent}
                    className="border-2 border-black p-2 w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Seleccione un componente
                    </option>
                    {components.map((component) => (
                      <option key={component.id} value={component.nombre}>
                        {component.nombre}
                      </option>
                    ))}
                  </select>

                  <div className="space-y-2 mt-4 h-[130px] overflow-y-auto">
                    {selectedComponents.map((component) => (
                      <div
                        key={component}
                        className="flex justify-between items-center border-2 border-green-500 p-2"
                      >
                        <span>{component}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(component)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="font-medium">Seleccione las actividades realizadas:</p>
              <select
                onChange={handleAddActivity}
                className="border-2 border-black p-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccione una actividad
                </option>
                {activities.map((activity) => (
                  <option 
                  key={activity.id} 
                  value={activity.nombre}>
                    {activity.nombre}
                  </option>
                ))}
              </select>

              <div className="space-y-2 mt-4 h-[150px] overflow-y-auto border border-gray-300">
                {selectedActivities.map((activity) => (
                  <div
                    value={activity.nombre}
                    id={activity.id}
                    className="space-y-2 mt-4 overflow-y-auto flex justify-between items-center border-2 border-green-500 p-2"
                    style={{ maxHeight: '200px' }} // Ajusta la altura máxima según lo necesario
                  >
                    <span>{activity.nombre}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(activity)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="observations">Observaciones:</label>
              <textarea
                onChange={(e) => setObservations(e.target.value)}
                id="observations"
                className="w-full min-h-[150px] border-2 border-black p-2"
                maxlength="150"
              />
            </div>
          </div>

         

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="submit"
              className="px-8 py-2 bg-black text-white hover:bg-gray-700"
              
            >
              Guardar
            </button>
            <button
              type="button"
              className="px-8 py-2 border border-black text-black hover:bg-gray-200"
              onClick={() => navigate('/InicioMantenimientos')} // Redirigir al presionar "Cancelar"
            >
              Cancelar
            </button>

          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
