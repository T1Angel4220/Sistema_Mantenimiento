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
  const [maintenanceType, setMaintenanceType] = useState('interno'); // Estado para tipo de mantenimiento
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
  useEffect(() => {
    const fetchAssets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/actividades');
            setActivities(response.data); // Suponiendo que los activos vienen en response.data
        } catch (error) {
            console.error("Error al cargar las actividades", error);
        }
    };
  
    fetchAssets();
  }, []); 
   useEffect(() => {
    const fetchAssets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/activos');
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
          setComponents(response.data); // Suponiendo que los activos vienen en response.data
      } catch (error) {
          console.error("Error al cargar los componentes:", error);
      }
  };

  fetchAssets();
}, []); // El efect
  const handleAddActivity = (e) => {
    const selected = e.target.value;
    if (selected && !selectedActivities.includes(selected)) {
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
      <h1 className="text-2xl font-bold mb-6">Mantenimiento de Activos</h1>

      <div className="space-y-6">
        <div>
          <p className="mb-4 text-center">
            El mantenimiento se realizará dentro de la institución (interno) o será externo?
          </p>
          <div className="flex justify-center items-center gap-4">
            <label className="flex items-center">
            <input
  type="radio"
  name="maintenance-type"
  value="interno"
  checked={maintenanceType === 'interno'}
  onChange={() => {
    setMaintenanceType('interno');
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
  value="externo"
  checked={maintenanceType === 'externo'}
  onChange={() => {
    setMaintenanceType('externo');
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

        {maintenanceType === 'externo' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="proveedor">Proveedor:</label>
              <input
                id="proveedor"
                className="border-2 border-black p-2 w-full"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label>Fecha estimada de entrega  : </label>
              <br />
              <DatePicker
                selected={estimatedDeliveryDate}
                onChange={(date) => setEstimatedDeliveryDate(date)}
                locale={es}
                dateFormat="dd/MM/yyyy"
                customInput={
                  <button className="border border-black p-2 flex items-center text-black w-64">
                    <Calendar className="mr-2 h-4 w-4 text-black" />
                    {estimatedDeliveryDate ? format(estimatedDeliveryDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}
                  </button>
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contacto">Contacto del Mantenimiento:</label>
              <input
                id="contacto"
                className="border-2 border-black p-2 w-full"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="costo">Costo del Mantenimiento:</label>
              <input
                id="costo"
                className="border-2 border-black p-2 w-full"
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="MTN0001"
            className="max-w-[200px] border-2 border-black p-2"
          />
        </div>

        {/* Modificación de la sección de activos */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="font-medium">Seleccione los activos que tendrá el mantenimiento:</p>
            <select
              onChange={handleSelectAsset}
              className="border-2 border-black p-2 w-full"
              defaultValue=""
            >
              <option value="" disabled>
                Seleccione un activo
              </option>
              {assets.map((asset) => (
                <option key={asset.codigo_barras} value={asset.id}>
                  {asset.codigo_barras}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p>Se agregaron o cambiaron componentes?</p>
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

                <div className="space-y-2 mt-4">
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
                <option key={activity.id} value={activity.nombre}>
                  {activity.nombre}
                </option>
              ))}
            </select>

            <div className="space-y-2 mt-4">
              {selectedActivities.map((activity) => (
                <div
                  key={activity}
                  className="flex justify-between items-center border-2 border-green-500 p-2"
                >
                  <span>{activity}</span>
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
              id="observations"
              className="w-full min-h-[150px] border-2 border-black p-2"
            />
          </div>
        </div>

        {maintenanceType === 'interno' && (
  <div className="grid md:grid-cols-2 gap-8">
    <div className="space-y-2">
      <label>Fecha de Inicio:</label>
      <br />
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        locale={es}
        dateFormat="dd/MM/yyyy"
        customInput={
          <button className="border border-black p-2 flex items-center text-black w-64">
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
        onChange={(date) => setEndDate(date)}
        locale={es}
        dateFormat="dd/MM/yyyy"
        customInput={
          <button className="border border-black p-2 flex items-center text-black w-64">
            <Calendar className="mr-2 h-4 w-4 text-black" />
            {endDate ? format(endDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}
          </button>
        }
      />
    </div>
  </div>
)}


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
      </div>
    </div>
    </div>
  );
}
