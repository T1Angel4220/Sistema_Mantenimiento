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
  const [equipmentComponents, setEquipmentComponents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); // "Sí" o "No" para cambios en componentes
  const [selectedEquipments, setSelectedEquipments] = useState([]);

  const [dateError, setDateError] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [equipo, setEquipo] = useState(false);
  const [actividades, setActividades] = useState(false);
  const handleComponentChangeSelection = (option) => {
    setSelectedOption(option);
    if (option === "No") {
      setEquipmentComponents({}); // Limpia los componentes si el usuario elige "No"
    }
  };
  useEffect(() => {
    axios.get('http://localhost:8000/api/mantenimientos_idMax')
      .then(response => {
        setIdMaximo(response.data + 1);
      })
      .catch(() => {
        setIdMaximo(1);
      });
  }, []);

  const [providers, setProviders] = useState([]); // Estado para los proveedores

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/proveedores');
        setProviders(response.data); // Recibe un array de {nombre, contacto}
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    };

    fetchProviders();
  }, []);
  const handleAddComponentToEquipment = (equipoId, componente) => {
    if (!componente || !componente.id) return; // Verifica que el componente sea válido
    setEquipmentComponents((prev) => {
      const updated = { ...prev };
      if (!updated[equipoId]) updated[equipoId] = [];
      const existe = updated[equipoId].some((comp) => comp.id === componente.id);
      if (!existe) {
        updated[equipoId].push({ ...componente, cantidad: 1 });
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activitiesResponse, componentsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/actividades'),
          axios.get('http://localhost:8000/api/componentes'),
        ]);

        setActivities(activitiesResponse.data);

        setComponents(componentsResponse.data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);


  const handleRemoveComponentFromEquipment = (equipoId, componenteId) => {
    setEquipmentComponents((prev) => {
      const updated = { ...prev };
      updated[equipoId] = updated[equipoId]?.filter((comp) => comp.id !== componenteId) || [];
      return updated;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
      setDateError(true);
      setTimeout(() => {
        setDateError(false);
      }, 1800);
      return;
    }
    if (selectedActivities.length==0) {
      setActividades(true);
      setTimeout(() => {
        setActividades(false);
      }, 1800);
      return;
    }
    if (selectedEquipments.length==0) {
      setEquipo(true);
      setTimeout(() => {
        setEquipo(false);
      }, 1800);
      return;
    }

    // Validar que todos los equipos tengan opción seleccionada
    const equiposSinSeleccion = selectedEquipments.filter(
      (equipment) => !equipmentOptions[equipment.id]
    );

    if (equiposSinSeleccion.length > 0) {
      alert(
        "Por favor, seleccione si se añadieron o cambiaron componentes (Sí o No) para todos los equipos seleccionados."
      );
      return;
    }

    // Validar que no haya componentes añadidos si se seleccionó "No"
    const equiposConComponentesInvalidos = Object.keys(equipmentOptions).filter(
      (equipmentId) =>
        equipmentOptions[equipmentId] === "No" &&
        equipmentComponents[equipmentId]?.length > 0
    );

    if (equiposConComponentesInvalidos.length > 0) {
      alert(
        "No puede marcar 'No' en equipos que tienen componentes añadidos."
      );
      return;
    }

    // Preparar datos para enviar
    const mantenimientoData = {
      codigo_mantenimiento: `MANT_${idMaximo}`,
      tipo: maintenanceType,
      fecha_inicio: startDate || null,
      fecha_fin: endDate || null,
      proveedor: maintenanceType === "Externo" ? provider : null,
      contacto_proveedor: maintenanceType === "Externo" ? contact : null,
      costo: maintenanceType === "Externo" ? parseFloat(cost) : null,
      observaciones: observations || null,
      actividades: selectedActivities.map((item) => item.id) || [],
      equipos: selectedEquipments.map((equipment) => (
        equipment.id
      )),
    };
    console.log(selectedComponents)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/componentesEquipos",
        selectedComponents, // Envía solo el array
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error al insertar los componentes:", error);
    }


    try {
      const response = await axios.post(
        "http://localhost:8000/api/mantenimientos",
        mantenimientoData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSubmit(true); // Mostrar el mensaje
      setTimeout(() => {
        setSubmit(false); // Ocultar el mensaje después de 3 segundos
        navigate("/InicioMantenimientos");
      }, 1800); 
     
    } catch (error) {
      console.error("Error al crear el mantenimiento:", error);
    }

  };



  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/actividades');
        setActivities(response.data);
      } catch (error) {
        console.error("Error al cargar las actividades", error);
      }
    };

    fetchAssets();
  }, []);


  const fetchEquipos = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/equipoDisponibles', {
        fecha_inicio: startDate,
        fecha_fin: endDate,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setAssets(response.data);
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  };



  useEffect(() => {
    if ((startDate && endDate && new Date(startDate) < new Date(endDate)))
      fetchEquipos();
    else
      setAssets([]);

  }, [startDate, endDate]);
  

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/componentes');
        setComponents(response.data);
      } catch (error) {
        console.error("Error al cargar los componentes:", error);
      }
    };

    fetchAssets();
  }, []); // Elefect
  const handleAddActivity = (e) => {
    const nombre = e.target.value;
    const actividad = activities.find((objeto) => objeto.nombre === nombre);

    if (!actividad) {
      console.error('Actividad no encontrada:', nombre);
      return;
    }

    const selected = { id: actividad.id, nombre: actividad.nombre };
    const existe = selectedActivities.some((activity) => activity.id === actividad.id);

    if (!existe) {
      setSelectedActivities([...selectedActivities, selected]);
    }

    e.target.value = ''; // Reinicia el valor del select
  };

  const [equipmentOptions, setEquipmentOptions] = useState({}); // Estado para "Sí" o "No" por equipo

  const handleEquipmentOptionChange = (equipmentId, option) => {
    setEquipmentOptions((prev) => ({
      ...prev,
      [equipmentId]: option,
    }));

    if (option === "No") {
      // Limpia los componentes si selecciona "No"
      setEquipmentComponents((prev) => {
        const updated = { ...prev };
        delete updated[equipmentId];
        return updated;
      });
    }
  };




  // Manejar la adición de equipos
  const handleAddEquipment = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedAsset = assets.find(asset => asset.id === selectedId);

    // Evitar duplicados
    if (selectedAsset && !selectedEquipments.some(equipment => equipment.id === selectedAsset.id)) {
      setSelectedEquipments([...selectedEquipments, selectedAsset]);
    }
    e.target.value = ''; // Reinicia el valor del select
  };

  // Manejar la eliminación de equipos seleccionados
  const handleRemoveEquipment = (id) => {
    setSelectedEquipments(selectedEquipments.filter(equipment => equipment.id !== id));
  };

  const handleRemoveActivity = (activity) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const handleSelectAsset = (e) => {
    setSelectedAsset(e.target.value); // Actualiza el activo seleccionado
  };

  const handleAddComponent = (e, idEquipo) => {
    const componente = components.find((item) => item.nombre === e.target.value);
    const selected = { equipo_mantenimiento_id: idEquipo, componente_id: componente.id, mantenimiento_id: parseInt(idMaximo)}
   
    if (selected && !selectedComponents.includes(selected)) {
      setSelectedComponents([...selectedComponents, selected]);
    }
  };

  const handleRemoveComponent = (component) => {
    setSelectedComponents(selectedComponents.filter((c) => c !== component));
  };

  return (
    <div className="main-container flex flex-col items-center bg-gray-100 min-h-screen">
      {/* Div de error que cubre toda la pantalla */}
      {dateError && (
        <div className="max-w-4xl w-full p-6 space-y-8 bg-red-500 shadow-md rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Rango de fechas inválido</h1>
        </div>
      )}
      {submit && (
        <div className="max-w-4xl w-full p-6 space-y-8 bg-green-500 shadow-md rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">Mantenimiento guardado correctamente</h1>
        </div>
      )}
      {actividades && (
        <div className="max-w-4xl w-full p-6 space-y-8 bg-red-500 shadow-md rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">No ha registrado actividades</h1>
        </div>
      )}
      {equipo && (
        <div className="max-w-4xl w-full p-6 space-y-8 bg-red-500 shadow-md rounded-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">No ha registrado equipos</h1>
        </div>
      )}

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
                    setProvider('');
                    setContact('');
                    setCost('');
                    setSelectedActivities([]); // Resetea las actividades
                    setSelectedComponents([]); // Resetea los componentes seleccionados
                    setObservations(''); // Resetea el campo de observaciones
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

                    setSelectedActivities([]); // Resetea las actividades
                    setSelectedComponents([]); // Resetea los componentes seleccionados
                    setObservations(''); // Resetea el campo de observaciones
                    setProvider(''); // Limpia el proveedor

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
                  onChange={
                    (date) => {
                      setStartDate(date);
                      setSelectedEquipments([]);
                    
                    }
                  }
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
                  onChange={(date) => {
                    if (startDate && date < startDate) {
                      alert('La fecha de fin no puede ser anterior a la fecha de inicio');
                      return;
                    }
                    setEndDate(date);
                    setSelectedEquipments([]);
                  }}
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  customInput={
                    <button
                      type="button"
                      className="border border-black p-2 flex items-center text-black w-64">
                      <Calendar className="mr-2 h-4 w-4 text-black" />
                      {endDate ? format(new Date(endDate), 'dd/MM/yyyy') : 'dd/mm/aaaa'}
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
                  <select
                    id="proveedor"
                    className="border-2 border-black p-2 w-full"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    required
                  >
                    <option value="" disabled>Seleccione un proveedor</option>
                    {providers.map((providerOption, index) => (
                      <option key={index} value={providerOption}>
                        {providerOption}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contacto">Contacto del Mantenimiento:</label>
                  <input
                    required
                    id="contacto"
                    maxLength="25"
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
            <div className="grid  gap-8">
              <div className="space-y-6">
                {/* SELECCIÓN DE EQUIPOS */}
                <div className="space-y-4">
                  <h2 className="font-medium">Seleccione los equipos que tendrá el mantenimiento:</h2>

                  <select
                    onChange={handleAddEquipment}
                    className="border border-gray-300 p-2 w-full rounded"
                    defaultValue=""
                    disabled={!(startDate && endDate && new Date(startDate) < new Date(endDate) && assets.length != 0)}

                  >
                    {assets.length === 0 ? (
                      <option value="" disabled>No hay equipos disponibles en el rango de fechas establecidos</option>
                    ) : (

                      <option value="" disabled>Seleccione un equipo</option>)}
                    {assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.Codigo_Barras} - {asset.Nombre_Producto}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MOSTRAR EQUIPOS SELECCIONADOS */}

                <div className="mt-6">
                  <h3 className="font-bold text-lg">Equipos seleccionados:</h3>
                  {selectedEquipments.length > 0 ? (
                    <div className="grid grid-flow-col auto-cols-max gap-6 overflow-x-auto max-w-[850px]">
                      {selectedEquipments.map((equipment) => (
                        <div
                          key={equipment.id}
                          className="border border-gray-300 rounded-lg p-4 bg-white shadow-lg min-w-[250px]"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-gray-700">
                              {equipment.Codigo_Barras} - {equipment.Nombre_Producto}
                            </span>
                            <button
                              onClick={() => handleRemoveEquipment(equipment.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Eliminar
                            </button>
                          </div>

                          {/* Pregunta para añadir componentes */}
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-800">
                              ¿Se añadieron o cambiaron componentes?
                            </h4>
                            <div className="flex gap-4 mt-2">
                              <button
                                type="button"
                                className={`px-4 py-2 rounded border transition-all ${equipmentOptions[equipment.id] === "Sí"
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                  }`}
                                onClick={() => handleEquipmentOptionChange(equipment.id, "Sí")}
                              >
                                Sí
                              </button>
                              <button
                                type="button"
                                className={`px-4 py-2 rounded border transition-all ${equipmentOptions[equipment.id] === "No"
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                  }`}
                                onClick={() => handleEquipmentOptionChange(equipment.id, "No")}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          {/* Mostrar selector de componentes si se seleccionó "Sí" */}
                          {equipmentOptions[equipment.id] === "Sí" && (
                            <div className="mt-6">
                              <h5 className="font-medium text-gray-800">Gestionar Componentes</h5>
                              <select
                                className="mt-2 border border-gray-300 p-2 w-full rounded bg-white"
                                defaultValue=""
                                onChange={(e) => handleAddComponent(e, equipment.id)} // Mueve el evento aquí
                              >
                                <option value="" disabled>
                                  Seleccione un componente
                                </option>
                                {components.map((component) => (
                                  <option
                                    key={component.id}
                                    value={component.nombre}
                                  >
                                    {component.nombre}
                                  </option>
                                ))}
                              </select>


                              {/* Lista de componentes asociados */}
                              {selectedComponents && selectedComponents
                                .filter((comp) => comp.equipo_mantenimiento_id === equipment.id)
                                .length > 0 && (
                                  <div className="mt-4">
                                    <h6 className="font-medium text-gray-700">Componentes:</h6>
                                    <ul className="mt-2 h-64 max-h-64 overflow-y-auto space-y-2">
                                      {selectedComponents
                                        .filter((comp) => comp.equipo_mantenimiento_id === equipment.id)
                                        .map((comp, index) => {
                                          const component = components.find((item) => item.id === comp.componente_id);
                                          return (
                                            <li
                                              key={index}
                                              className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                            >
                                              <span>{component ? component.nombre : "Componente desconocido"}</span>
                                              <button
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  setSelectedComponents((prev) =>
                                                    prev.filter(
                                                      (item) =>
                                                        !(
                                                          item.equipo_mantenimiento_id == equipment.id &&
                                                          item.componente_id == comp.componente_id
                                                        )
                                                    )
                                                  );
                                                }}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                              >
                                                Eliminar
                                              </button>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </div>
                                )}


                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No se han seleccionado equipos.</p>
                  )}
                </div>


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