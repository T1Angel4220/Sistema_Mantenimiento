<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Activo;
use Carbon\Carbon;

class ActivoController extends Controller
{
    
    public function index()
    {
        $activos = Activo::all();
        return $activos;
    }

    public function obtenerActivosDisponibles(Request $request)
    {
        
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);
    
        $fechaInicio = $validated['fecha_inicio'];
        $fechaFin = $validated['fecha_fin'];
    
        // Activos sin ningún mantenimiento
        $activosSinMantenimiento = Activo::whereDoesntHave('mantenimientos')->pluck('id');
    
        // Activos con mantenimientos fuera del rango
        $activosFueraRango = Activo::whereHas('mantenimientos', function ($query) use ($fechaInicio, $fechaFin) {
            $query->where(function ($subQuery) use ($fechaInicio, $fechaFin) {
                $subQuery->where('fecha_inicio', '>', $fechaFin)
                         ->orWhere('fecha_fin', '<', $fechaInicio);
            });
        })->pluck('id');
    
        // Combinar los IDs de ambos conjuntos
        $activosDisponiblesIds = $activosSinMantenimiento->merge($activosFueraRango)->unique();
    
        // Recuperar los registros completos de los activos disponibles
        $activosDisponibles = Activo::whereIn('id', $activosDisponiblesIds)->get();
    
        return response()->json($activosDisponibles);
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
