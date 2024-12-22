import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mantenimientos.css';

export default function MaintenanceForm() {
    const navigate = useNavigate();
    const [maintenanceType, setMaintenanceType] = useState("interno");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [componentsChanged, setComponentsChanged] = useState("no");
    const [showProveedorButtons, setShowProveedorButtons] = useState(true); // Estado para el botón desplegable
    const [selectedComponents, setSelectedComponents] = useState([]); // Estado para componentes seleccionados
    const [assets, setAssets] = useState([]); // Estado para los activos cargados desde la API

    // Agregar componente seleccionado a la lista
    const handleComponentAdd = (e) => {
        const selectedOption = e.target.value;
        if (selectedOption && !selectedComponents.includes(selectedOption)) {
            setSelectedComponents([...selectedComponents, selectedOption]);
        }
        e.target.value = ""; // Reinicia el dropdown
    };
    
    // Eliminar un componente de la lista
    const handleComponentRemove = (component, event) => {
      event.preventDefault(); // Prevenir recarga de página
      setSelectedComponents(selectedComponents.filter(item => item !== component));
  };
  
    
  

    // Realizar la solicitud HTTP para cargar los activos desde la API
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
    const activities = [
      'Formateo',
      'Limpieza',
      'Actualización de Software',
      'Instalación de Controladores',
      'Actualización de Firmware',
      'Verificación de Conexiones',
      'Pruebas de Diagnóstico',
      'Optimización del Sistema Operativo',
      'Desfragmentación del Disco Duro',
      'Revisión de Seguridad Antivirus',
      'Restauración de Sistemas',
      'Calibración de Componentes',
      'Verificación de Licencias de Software',
      'Mantenimiento Preventivo de Impresoras',
      'Monitoreo de Temperatura',
      'Gestión de Inventario de Activos',
      'Auditoría de Uso de Software',
      'Actualización de Documentación Técnica',
      'Revisión de Conexiones de Red',
      'Optimización de Consumo Energético',
    ];
    
    const components = ['Disco', 'Ventilador', 'Tarjeta RAM'];

    return (
        
        <div className="main-container">
            {/* Sidebar */}
            <div className="main-sidebar">
                <div className="main-sidebar-header">
                    <h2 className="main-sidebar-title">SK TELECOM</h2>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
                        alt="Logo SK Telecom"
                        className="main-sidebar-logo"
                    />
                </div>
                <button className="main-sidebar-btn" onClick={() => navigate('/Main')}>Inicio</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/ProcesoCompra')}>Proceso de Compra</button>
                <button className="main-sidebar-btn" onClick={() => navigate('/equipos')}>Activos</button>

                <button
                    className="main-sidebar-btn"
                    onClick={() => setShowProveedorButtons(!showProveedorButtons)} // Alternar visibilidad
                >
                    Mantenimientos
                </button>
                
                {showProveedorButtons && (
                    <div className="proveedor-buttons">
                        <button
                            className="main-sidebar-btn-create"
                            onClick={() => navigate('/AniadirMantenimiento')}
                        >
                            Añadir Mantenimiento
                        </button>
                    </div>
                )}

                <button className="main-sidebar-btn" onClick={() => navigate('/reportes')}>Reportes</button>
                <button className="main-logout-btn" onClick={() => navigate('/Main')}>Regresar</button>
            </div>
      {/* Formulario */}
      <div className="mantenimiento-container">
        <h1 className="mantenimiento-title">Mantenimiento de Activos</h1>

        <form className="mantenimiento-form">
          <div className="mantenimiento-form-group">
            <label>El mantenimiento se realizará dentro de la institución (interno) o será externo?</label>
            <div className="mantenimiento-radio-group">
              <label>
                <input
                  type="radio"
                  name="maintenanceType"
                  value="interno"
                  checked={maintenanceType === "interno"}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                />
                <span>Interno</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="maintenanceType"
                  value="externo"
                  checked={maintenanceType === "externo"}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                />
                <span>Externo</span>
              </label>
            </div>
          </div>

          {maintenanceType === "externo" && (
            <div className="mantenimiento-grid">
              <div className="mantenimiento-form-group">
                <label htmlFor="mtn">MTN:</label>
                <input id="mtn" type="text" placeholder="MTN0001" className="mantenimiento-input" />
              </div>
              <div className="mantenimiento-form-group">
                <label htmlFor="proveedor">Proveedor:</label>
                <input id="proveedor" type="text" className="mantenimiento-input" />
              </div>
              <div className="mantenimiento-form-group">
                <label htmlFor="contacto">Contacto del Mantenimiento:</label>
                <input id="contacto" type="text" className="mantenimiento-input" />
              </div>
              <div className="mantenimiento-form-group">
                <label htmlFor="costo">Costo del Mantenimiento:</label>
                <input id="costo" type="number" className="mantenimiento-input" />
              </div>
              <div className="mantenimiento-form-group">
                <label htmlFor="endDate">Fecha Estimada de Fin:</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mantenimiento-input"
                />
              </div>
            </div>
          )}

          {maintenanceType === "interno" && (
            <div className="mantenimiento-grid">
              <div className="mantenimiento-form-group">
                <label htmlFor="mtn">MTN:</label>
                <input id="mtn" type="text" placeholder="MTN0001" className="mantenimiento-input" />
              </div>
              <div className="mantenimiento-form-group">
                <label htmlFor="startDate">Fecha de Inicio:</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mantenimiento-input"
                />
              </div>
              <div className="mantenimiento-form-group">
                <label htmlFor="endDate">Fecha Estimada de Fin:</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mantenimiento-input"
                />
              </div>
            </div>
          )}

          <div className="mantenimiento-form-group">
            <label htmlFor="assets">Seleccione los activos que tendrá el mantenimiento:</label>
            <select id="assets" className="mantenimiento-select">
              <option value="">Seleccione los activos</option>
              {assets.map((asset) => (
                <option key={asset} value={asset}>{asset}</option>
              ))}
            </select>
          </div>

          <div className="mantenimiento-form-group">
            <label>Se agregaron o cambiaron componentes?</label>
            <div className="mantenimiento-radio-group">
              <label>
                <input
                  type="radio"
                  name="componentsChanged"
                  value="si"
                  checked={componentsChanged === "si"}
                  onChange={(e) => setComponentsChanged(e.target.value)}
                />
                <span>Sí</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="componentsChanged"
                  value="no"
                  checked={componentsChanged === "no"}
                  onChange={(e) => setComponentsChanged(e.target.value)}
                />
                <span>No</span>
              </label>
            </div>
            {componentsChanged === "si" && (
    <div className="mantenimiento-form-group">
        <label>Seleccione los componentes:</label>
        <select onChange={handleComponentAdd} className="mantenimiento-select">
            <option value="">Seleccione un componente</option>
            {components.map((component) => (
                <option key={component} value={component}>{component}</option>
            ))}
        </select>

        {/* Lista de componentes seleccionados */}
        <div>
            <h3>Componentes seleccionados:</h3>
            <ul>
    {selectedComponents.map((component, index) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <button
                type="button" // Asegurarse de que no sea un botón de envío
                onClick={(e) => handleComponentRemove(component, e)}
                style={{
                    marginRight: '10px',
                    color: 'white',
                    backgroundColor: 'red',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    padding: '2px 5px'
                }}
            >
                X
            </button>
            {component}
        </li>
    ))}
</ul>

        </div>
    </div>
)}

          </div>

          <div className="mantenimiento-form-group">
            <label htmlFor="activities">Seleccione las actividades realizadas:</label>
            <select id="activities" className="mantenimiento-select">
              <option value="">Seleccione las actividades</option>
              {activities.map((activity) => (
                <option key={activity} value={activity}>{activity}</option>
              ))}
            </select>
          </div>

          <div className="mantenimiento-form-group">
            <label htmlFor="observaciones">Observaciones:</label>
            <textarea id="observaciones" className="mantenimiento-textarea" />
          </div>

          <div className="mantenimiento-button-group">
            <button type="submit" className="mantenimiento-button mantenimiento-button-primary">Guardar</button>
            <button type="button" className="mantenimiento-button mantenimiento-button-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
