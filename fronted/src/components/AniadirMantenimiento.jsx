import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Home, ShoppingCart, Box, PenTool, FileText, LogOut } from 'lucide-react';

import 'react-datepicker/dist/react-datepicker.css';

export default function AssetMaintenanceForm() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [showComponents, setShowComponents] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('Interno');
  const [provider, setProvider] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(null);
  const [contact, setContact] = useState('');
  const [cost, setCost] = useState('');
  const [observations, setObservations] = useState('');
  const [showProveedorButtons, setShowProveedorButtons] = useState(false);
  const [assets, setAssets] = useState([]);
  const [components, setComponents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [idMaximo, setIdMaximo] = useState(null);
  const today = new Date();
  const [equipmentComponents, setEquipmentComponents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [dateError, setDateError] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [equipo, setEquipo] = useState(false);
  const [actividades, setActividades] = useState(false);
  const [providers, setProviders] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState({});

  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/reportes' },
  ];

  useEffect(() => {
    axios.get('http://localhost:8000/api/mantenimientos_idMax')
      .then(response => {
        setIdMaximo(response.data + 1);
      })
      .catch(() => {
        setIdMaximo(1);
      });
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/proveedores');
        setProviders(response.data);
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    };

    fetchProviders();
  }, []);

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

  useEffect(() => {
    if ((startDate && endDate && new Date(startDate) < new Date(endDate)))
      fetchEquipos();
    else
      setAssets([]);
  }, [startDate, endDate]);

  const handleComponentChangeSelection = (option) => {
    setSelectedOption(option);
    if (option === "No") {
      setEquipmentComponents({});
    }
  };

  const handleAddComponentToEquipment = (equipoId, componente) => {
    if (!componente || !componente.id) return;
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
    if (selectedActivities.length == 0) {
      setActividades(true);
      setTimeout(() => {
        setActividades(false);
      }, 1800);
      return;
    }
    if (selectedEquipments.length == 0) {
      setEquipo(true);
      setTimeout(() => {
        setEquipo(false);
      }, 1800);
      return;
    }

    const equiposSinSeleccion = selectedEquipments.filter(
      (equipment) => !equipmentOptions[equipment.id]
    );

    if (equiposSinSeleccion.length > 0) {
      alert(
        "Por favor, seleccione si se añadieron o cambiaron componentes (Sí o No) para todos los equipos seleccionados."
      );
      return;
    }

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

    try {
      const response = await axios.post(
        "http://localhost:8000/api/componentesEquipos",
        selectedComponents,
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
      setSubmit(true);
      setTimeout(() => {
        setSubmit(false);
        navigate("/InicioMantenimientos");
      }, 1800);
     
    } catch (error) {
      console.error("Error al crear el mantenimiento:", error);
    }
  };

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

    e.target.value = '';
  };

  const handleEquipmentOptionChange = (equipmentId, option) => {
    setEquipmentOptions((prev) => ({
      ...prev,
      [equipmentId]: option,
    }));

    if (option === "No") {
      setEquipmentComponents((prev) => {
        const updated = { ...prev };
        delete updated[equipmentId];
        return updated;
      });
    }
  };

  const handleAddEquipment = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedAsset = assets.find(asset => asset.id === selectedId);

    if (selectedAsset && !selectedEquipments.some(equipment => equipment.id === selectedAsset.id)) {
      setSelectedEquipments([...selectedEquipments, selectedAsset]);
    }
    e.target.value = '';
  };

  const handleRemoveEquipment = (id) => {
    setSelectedEquipments(selectedEquipments.filter(equipment => equipment.id !== id));
  };

  const handleRemoveActivity = (activity) => {
    setSelectedActivities(selectedActivities.filter((a) => a !== activity));
  };

  const handleSelectAsset = (e) => {
    setSelectedAsset(e.target.value);
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Ahora con position fixed */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-[#1a374d] text-white flex flex-col z-10">
        <div className="p-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
            alt="Logo SK Telecom"
            className="h-12 w-auto"
          />
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                className="w-full flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => navigate(item.route)}
              >
                <Icon className="mr-2 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4">
          <button 
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/InicioMantenimientos')}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Regresar
          </button>
        </div>
      </aside>

      {/* Main Content - Con padding-left para el sidebar y scroll independiente */}
      <main className="flex-1 pl-64 w-full h-screen overflow-y-auto bg-gray-100">
        <div className="container mx-auto py-6 px-4">
          {/* Alertas y mensajes */}
          {dateError && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">Rango de fechas inválido</h1>
              </div>
            </div>
          )}
          {submit && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">Mantenimiento guardado correctamente</h1>
              </div>
            </div>
          )}
          {actividades && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">No ha registrado actividades</h1>
              </div>
            </div>
          )}
          {equipo && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                <h1 className="text-xl font-bold">No ha registrado equipos</h1>
              </div>
            </div>
          )}

          {/* Contenido del formulario */}
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
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
                        setSelectedActivities([]);
                        setSelectedComponents([]);
                        setObservations('');
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
                        setSelectedActivities([]);
                        setSelectedComponents([]);
                        setObservations('');
                        setProvider('');
                        setContact('');
                        setCost('');
                      }}
                      className="mr-2 accent-black"
                    />
                    Externo
                  </label>
                </div>
              </div>

              <label className="max-w-[200px] p-2">
                Codigo de Mantenimiento: MANT_{idMaximo}
              </label>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label>Fecha de Inicio:</label>
                    <br />
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setSelectedEquipments([]);
                      }}
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
                          {endDate ? format(endDate, 'dd/MM/yyyy') : 'dd/mm/aaaa'}
                        </button>
                      }
                    />
                  </div>
                </div>

                {maintenanceType === 'Externo' && (
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
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

                <div className="mt-8">
                  <div className="space-y-6">
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
                          <option value="" disabled>Seleccione un equipo</option>
                        )}
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.Codigo_Barras} - {asset.Nombre_Producto}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-4">Equipos seleccionados:</h3>
                      {selectedEquipments.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2">
                          {selectedEquipments.map((equipment) => (
                            <div
                              key={equipment.id}
                              className="border border-gray-300 rounded-lg p-4 bg-white shadow-lg"
                            >
                              <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold text-gray-700">
                                  {equipment.Codigo_Barras} - {equipment.Nombre_Producto}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEquipment(equipment.id)}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  Eliminar
                                </button>
                              </div>

                              <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">
                                  ¿Se añadieron o cambiaron componentes?
                                </h4>
                                <div className="flex gap-4">
                                  <button
                                    type="button"
                                    className={`px-4 py-2 rounded border transition-all ${
                                      equipmentOptions[equipment.id] === "Sí"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                    }`}
                                    onClick={() => handleEquipmentOptionChange(equipment.id, "Sí")}
                                  >
                                    Sí
                                  </button>
                                  <button
                                    type="button"
                                    className={`px-4 py-2 rounded border transition-all ${
                                      equipmentOptions[equipment.id] === "No"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                                    }`}
                                    onClick={() => handleEquipmentOptionChange(equipment.id, "No")}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>

                              {equipmentOptions[equipment.id] === "Sí" && (
                                <div className="mt-6">
                                  <h5 className="font-medium text-gray-800 mb-2">Gestionar Componentes</h5>
                                  <select
                                    className="border border-gray-300 p-2 w-full rounded bg-white"
                                    defaultValue=""
                                    onChange={(e) => handleAddComponent(e, equipment.id)}
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

                                  {selectedComponents && selectedComponents
                                    .filter((comp) => comp.equipo_mantenimiento_id === equipment.id)
                                    .length > 0 && (
                                      <div className="mt-4">
                                        <h6 className="font-medium text-gray-700 mb-2">Componentes:</h6>
                                        <ul className="space-y-2 max-h-48 overflow-y-auto">
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
                                                    type="button"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      setSelectedComponents((prev) =>
                                                        prev.filter(
                                                          (item) =>
                                                            !(
                                                              item.equipo_mantenimiento_id === equipment.id &&
                                                              item.componente_id === comp.componente_id
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

                <div className="grid md:grid-cols-2 gap-8 mt-8">
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

                    <div className="border border-gray-300 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                      {selectedActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex justify-between items-center p-2 mb-2 border border-green-500 rounded"
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
                      className="w-full min-h-[300px] border-2 border-black p-2 rounded-lg"
                      maxLength="150"
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button
                    type="submit"
                    className="px-8 py-2 bg-black text-white hover:bg-gray-700 rounded-md transition-colors"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="px-8 py-2 border border-black text-black hover:bg-gray-200 rounded-md transition-colors"
                    onClick={() => navigate('/InicioMantenimientos')}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

