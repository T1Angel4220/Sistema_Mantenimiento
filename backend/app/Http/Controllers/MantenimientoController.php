<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mantenimiento;
class MantenimientoController extends Controller
{
   
    public function index()
    {
        $mantenimientos = Mantenimiento::all();
        return $mantenimientos;
    }

    
    public function create()
    {
        // Si se requiere un formulario de creación, puedes devolver una vista
        // return view('mantenimiento.create');
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'codigo_mantenimiento' => 'required|unique:mantenimiento|max:20',
            'tipo' => 'required|in:Interno,Externo',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'required|date',
            'proveedor' => 'nullable|in:ACME Maintenance,TechSupport S.A.,ServiMaq Ltda.,Otro',
            'contacto_proveedor' => 'nullable|string|max:255',
            'costo' => 'nullable|numeric',
            'observaciones' => 'nullable|string',
        ]);

        $mantenimiento = Mantenimiento::create($request->all());

        return response()->json($mantenimiento, 201); // Devuelve el mantenimiento recién creado
    }

   
    public function show($id)
    {
        $mantenimiento = Mantenimiento::findOrFail($id);
        return response()->json($mantenimiento);
    }

    /**
     * Mostrar el formulario para editar un mantenimiento específico.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        // Si se requiere un formulario de edición, puedes devolver una vista
        // return view('mantenimiento.edit', compact('id'));
    }

   
    public function update(Request $request, $id)
    {
        $mantenimiento = Mantenimiento::findOrFail($id);

        $request->validate([
            'codigo_mantenimiento' => 'required|max:20|unique:mantenimiento,codigo_mantenimiento,' . $mantenimiento->id,
            'tipo' => 'required|in:Interno,Externo',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'required|date',
            'proveedor' => 'nullable|in:ACME Maintenance,TechSupport S.A.,ServiMaq Ltda.,Otro',
            'contacto_proveedor' => 'nullable|string|max:255',
            'costo' => 'nullable|numeric',
            'observaciones' => 'nullable|string',
        ]);

        $mantenimiento->update($request->all());

        return response()->json($mantenimiento);
    }

    
    public function destroy($id)
    {
        $mantenimiento = Mantenimiento::findOrFail($id);
        $mantenimiento->delete();

        return response()->json(null, 204); // Responde con estado 204 sin contenido
    }
}
