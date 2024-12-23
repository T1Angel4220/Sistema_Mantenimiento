<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ActivoMantenimiento;


class ActivoMantenimientoController extends Controller
{
    public function index()
    {
        $registros = ActivoMantenimiento::all();
        return response()->json($registros);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mantenimiento_id' => 'required|exists:mantenimiento,id',
            'activo_id' => 'required|exists:activos,id',
        ]);

        $registro = ActivoMantenimiento::create($validated);
        return response()->json($registro, 201);
    }

    public function show($id)
    {
        $registro = ActivoMantenimiento::findOrFail($id);
        return response()->json($registro);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'mantenimiento_id' => 'required|exists:mantenimiento,id',
            'activo_id' => 'required|exists:activos,id',
        ]);

        $registro = ActivoMantenimiento::findOrFail($id);
        $registro->update($validated);
        return response()->json($registro);
    }

    public function destroy($id)
    {
        $registro = ActivoMantenimiento::findOrFail($id);
        $registro->delete();
        return response()->json(null, 204);
    }
}
