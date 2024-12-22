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

    

    // Método para eliminar un mantenimiento por su id
    public function destroy($id)
    {
        try {
            $mantenimiento = Mantenimiento::destroy($id);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar elmantenimiento', 'error' => $e->getMessage()], 500);
        }
    }
}
