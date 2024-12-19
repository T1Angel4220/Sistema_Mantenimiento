import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Card from "@/components/ui/card"; // Usando tu componente personalizado

const initialPurchases = [
  { id: 1, name: "Compra inicial", description: "Adquisición de productos básicos", date: "2024-12-20", provider: "Amazon" },
  { id: 2, name: "Compra secundaria", description: "Equipos de oficina", date: "2024-12-21", provider: "eBay" },
  { id: 3, name: "Compra internacional", description: "Materiales importados", date: "2024-12-22", provider: "Alibaba" },
  { id: 4, name: "Compra local", description: "Productos de empresas locales", date: "2024-12-23", provider: "MercadoLibre" },
  { id: 5, name: "Compra de emergencia", description: "Suministros urgentes", date: "2024-12-24", provider: "Shopify" },
];

export default function PurchaseProcess() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [provider, setProvider] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPurchase = {
      id: purchases.length + 1,
      name,
      description,
      date,
      provider,
    };
    setPurchases([...purchases, newPurchase]);
    handleClear();
  };

  const handleClear = () => {
    setName('');
    setDescription('');
    setDate('');
    setProvider('');
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Formulario */}
      <Card>
        <div className="text-2xl text-center text-red-500 font-bold mb-4">
          Proceso de Compra
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nombre
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingrese el nombre del proceso de compra"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="provider" className="text-sm font-medium text-gray-700">
                Proveedor
              </label>
              <Input
                id="provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="Ingrese el nombre del proveedor"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-gray-700">
                Fecha
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descripción
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describa el proceso de compra"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-4">
  <Button 
    type="submit" 
    className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded-md"
  >
    Guardar
  </Button>
  <Button 
    type="button" 
    onClick={handleClear} 
    className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-md"
  >
    Borrar
  </Button>
</div>

        </form>
      </Card>

      {/* Tabla de compras */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>NOMBRE</TableHead>
              <TableHead>DESCRIPCIÓN</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>PROVEEDOR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.id}</TableCell>
                <TableCell>{purchase.name}</TableCell>
                <TableCell>{purchase.description}</TableCell>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>{purchase.provider}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
