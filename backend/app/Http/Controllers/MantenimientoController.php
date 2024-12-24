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
    
        $validated = $request;

        $mantenimiento = Mantenimiento::create([
            'codigo_mantenimiento' => $validated['codigo_mantenimiento'],
            'tipo' => $validated['tipo'],
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'],
            'proveedor' => $validated['proveedor'],
            'contacto_proveedor' => $validated['contacto_proveedor'],
            'costo' => $validated['costo'],
            'observaciones' => $validated['observaciones'],
            'equipos'=> $validated['equipos'],
            'activdades'=> $validated['actividades']
        ]);

        // Asociar los activos al mantenimiento
        $mantenimiento->equipos()->sync($validated['equipos']);
        $mantenimiento->actividades()->sync($validated['actividades']);
        // Retornar el mantenimiento con los activos asociados
        return $mantenimiento;
    
    }
    public function obtenerIdMaximo()
    {
        $idMaximo = Mantenimiento::max('id');
        return $idMaximo;
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
