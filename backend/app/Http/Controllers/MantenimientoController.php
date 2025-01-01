<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use App\Models\EquipoMantenimiento;
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
    public function show($id)
    {
        // Obtener el mantenimiento con sus actividades y equipos
        $mantenimiento = Mantenimiento::with(['actividades', 'equipos'])->findOrFail($id);
        
        // Obtener los componentes relacionados con la actividad específica y la cantidad
        $componentes = \DB::table('equipo_componentes')
            ->join('componentes', 'equipo_componentes.componente_id', '=', 'componentes.id')
            ->where('equipo_componentes.mantenimiento_id', $id)
            ->select('componentes.*', 'equipo_componentes.cantidad')
            ->get();
        
        // Devolver la respuesta en formato JSON
        return response()->json([
            'mantenimiento' => $mantenimiento,
            'componentes' => $componentes
        ]);
    }
    


    public function getActividades($id)
    {
        $mantenimiento = Mantenimiento::findOrFail($id);
        return response()->json($mantenimiento->actividades);
    }

    public function getComponentes($id)
    {
        return DB::table('equipo_componentes')
            ->join('componentes', 'equipo_componentes.componente_id', '=', 'componentes.id')
            ->join('equipo_mantenimiento', 'equipo_componentes.equipo_mantenimiento_id', '=', 'equipo_mantenimiento.id')
            ->where('equipo_mantenimiento.mantenimiento_id', $id)
            ->select('componentes.*', 'equipo_componentes.cantidad')
            ->get();
    }
    public function getEquipos($id)
    {
        $mantenimiento = Mantenimiento::findOrFail($id);
        return response()->json($mantenimiento->equipos);
    }


   
    public function store(Request $request)
    {
        try {
            // Validar los datos del request
            $validated = $request->validate([
                'codigo_mantenimiento' => 'required|max:20|unique:mantenimiento,codigo_mantenimiento',
                'tipo' => 'required|in:Interno,Externo',
                'fecha_inicio' => 'nullable|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
                'proveedor' => 'nullable|string|max:255|required_if:tipo,Externo',
                'contacto_proveedor' => 'nullable|string|max:255|required_if:tipo,Externo',
                'costo' => 'nullable|numeric|min:0|required_if:tipo,Externo',
                'observaciones' => 'nullable|string',
                'actividades' => 'nullable|array',
                'equipos' => 'nullable|array',
            ]);
    
            // Crear el mantenimiento
            $mantenimiento = Mantenimiento::create([
                'codigo_mantenimiento' => $validated['codigo_mantenimiento'],
                'tipo' => $validated['tipo'],
                'fecha_inicio' => $validated['fecha_inicio'],
                'fecha_fin' => $validated['fecha_fin'],
                'proveedor' => $validated['proveedor'] ?? null,
                'contacto_proveedor' => $validated['contacto_proveedor'] ?? null,
                'costo' => $validated['costo'] ?? null,
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            if (!empty($validated['equipos'])) {
                $mantenimiento->equipos()->sync($validated['equipos']);
            }
            // Sincronizar las actividades (si existen)
            if (!empty($validated['actividades'])) {
                $mantenimiento->actividades()->sync($validated['actividades']);
            }
    
            return response()->json($mantenimiento, 201);
        } catch (\Exception $e) {
            \Log::error('Error al crear mantenimiento: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Error al crear mantenimiento.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function obtenerIdMaximo()
    {
        $idMaximo = Mantenimiento::max('id');
        return $idMaximo;
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

    public function getProveedores()
    {
        try {
            // Ejecutar la consulta para obtener los valores del tipo ENUM "proveedor"
            $result = DB::select("SELECT unnest(enum_range(NULL::\"proveedor\")) AS value");
    
            // Formatear el resultado como un arreglo simple de valores
            $values = array_map(function ($row) {
                return $row->value;
            }, $result);
    
            return response()->json($values);
        } catch (\Exception $e) {
            // Registrar el error en los logs
            \Log::error('Error al obtener proveedores: ' . $e->getMessage());
    
            return response()->json([
                'error' => 'Error al obtener proveedores.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function storeComponentes(Request $request, $mantenimientoId)
    {
        $validated = $request->validate([
            'componentes' => 'required|array',
            'componentes.*.id' => 'required|exists:componentes,id',
            'componentes.*.cantidad' => 'required|integer|min:1',
        ]);

        $equipoMantenimiento = EquipoMantenimiento::where('mantenimiento_id', $mantenimientoId)->first();

        if (!$equipoMantenimiento) {
            return response()->json(['error' => 'No se encontró el equipo de mantenimiento'], 404);
        }

        foreach ($validated['componentes'] as $componente) {
            $equipoMantenimiento->componentes()->attach($componente['id'], ['cantidad' => $componente['cantidad']]);
        }

        return response()->json(['message' => 'Componentes agregados correctamente'], 200);
    }
    
}
