<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProcesoCompra;

class ProcesoCompraController extends Controller
{
    // Obtener todos los procesos de compra
    public function index()
    {
        $compras = ProcesoCompra::all();
        return response()->json($compras);
    }

    // Guardar un nuevo proceso de compra
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'provider' => 'required|string|max:255',
        ]);
    
        // Guardar los datos en la base de datos
        $compra = ProcesoCompra::create([
            'nombre' => $request->name,
            'descripcion' => $request->description,
            'fecha' => $request->date,
            'proveedor' => $request->provider,
        ]);
    
        return response()->json($compra, 201);
    }    
    
}
