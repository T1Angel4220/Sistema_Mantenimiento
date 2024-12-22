<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activo;

class ActivoController extends Controller
{
    
    public function index()
    {
        $activos = Activo::all();
        return $activos;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('activos.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'codigo_barras' => 'required|unique:activos|max:100',
            'nombre' => 'required|max:255',
            'tipo_activo' => 'required',
            'ubicacion' => 'required',
        ]);

        Activo::create($request->all());

        return redirect()->route('activos.index')->with('success', 'Activo creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Activo $activo)
    {
        return view('activos.show', compact('activo'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Activo $activo)
    {
        return view('activos.edit', compact('activo'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Activo $activo)
    {
        $request->validate([
            'codigo_barras' => 'required|max:100|unique:activos,codigo_barras,' . $activo->id,
            'nombre' => 'required|max:255',
            'tipo_activo' => 'required',
            'ubicacion' => 'required',
        ]);

        $activo->update($request->all());

        return redirect()->route('activos.index')->with('success', 'Activo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activo $activo)
    {
        $activo->delete();

        return redirect()->route('activos.index')->with('success', 'Activo eliminado exitosamente.');
    }
}
