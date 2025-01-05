import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, ShoppingCart, Box, PenTool, FileText, LogOut } from 'lucide-react';

const ProcesoCompra = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    provider: '',
    providerOther: ''
  });
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/proceso-compra')
      .then(response => setPurchases(response.data))
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.name && form.description && form.date && form.provider) {
      try {
        const response = await axios.post('http://localhost:8000/api/proceso-compra', form);
        setPurchases([...purchases, response.data]);
        setForm({ name: '', description: '', date: '', provider: '', providerOther: '' });
        alert('Proceso de compra creado correctamente');
      } catch (error) {
        console.error('Error completo:', error.response);
        alert(`Error: ${error.response?.data?.message || 'Ocurrió un error inesperado.'}`);
      }
    }
  };

  const navItems = [
    { icon: Home, label: 'Inicio', route: '/Main' },
    { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
    { icon: Box, label: 'Activos', route: '/equipos' },
    { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
    { icon: FileText, label: 'Reportes', route: '/reportes' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a374d] text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 space-y-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
            alt="Logo SK Telecom"
            className="h-12 w-auto"
          />
        </div>
        <nav className="space-y-1 px-3 flex-1">
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
        <div className="p-4 mt-auto">
          <button 
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/Main')}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Regresar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
              Proceso de Compra
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Ingrese los detalles del nuevo proceso de compra
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del proceso de compra"
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describa el proceso de compra"
                  required
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Proveedor
                </label>
                <select
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccione un proveedor</option>
                  <option value="Amazon">Amazon</option>
                  <option value="eBay">eBay</option>
                  <option value="Alibaba">Alibaba</option>
                  <option value="MercadoLibre">MercadoLibre</option>
                  <option value="Shopify">Shopify</option>
                  <option value="Otro">Otro</option>
                </select>

                {form.provider === 'Otro' && (
                  <input
                    type="text"
                    name="providerOther"
                    value={form.providerOther}
                    onChange={handleChange}
                    placeholder="Escriba el nombre del proveedor"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => setForm({ name: '', description: '', date: '', provider: '', providerOther: '' })}
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-[#2f3b52]">
            <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Proveedor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.proveedor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcesoCompra;

