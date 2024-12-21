<?php

namespace App\Http\Controllers;

use App\Models\Mantenimiento;
use Illuminate\Http\Request;

class MantenimientoController extends Controller
{
    // Método para obtener todos los mantenimientos
    public function index()
    {
        try {
            $mantenimientos = Mantenimiento::all();
            return response()->json($mantenimientos);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener los mantenimientos', 'error' => $e->getMessage()], 500);
        }
    }

    // Método para obtener un mantenimiento por su id
    public function show($id)
    {
        try {
            $mantenimiento = Mantenimiento::find($id);
            if ($mantenimiento) {
                return response()->json($mantenimiento);
            } else {
                return response()->json(['message' => 'Mantenimiento no encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener el mantenimiento', 'error' => $e->getMessage()], 500);
        }
    }

    // Método para eliminar un mantenimiento por su id
    public function destroy($id)
    {
        try {
            $mantenimiento = Mantenimiento::find($id);
            if ($mantenimiento) {
                $mantenimiento->delete();
                return response()->json(['message' => 'Mantenimiento eliminado correctamente']);
            } else {
                return response()->json(['message' => 'Mantenimiento no encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el mantenimiento', 'error' => $e->getMessage()], 500);
        }
    }
}
