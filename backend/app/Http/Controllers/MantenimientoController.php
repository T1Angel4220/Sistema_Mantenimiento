<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use App\Models\EquipoMantenimiento;
use App\Models\EquipoComponente;
use App\Models\Equipo;
use App\Models\Actividad;
use Illuminate\Support\Facades\Log;
class MantenimientoController extends Controller
{
   
    public function index()
    {
        $mantenimientos = DB::table('mantenimiento')
            ->leftJoin('equipo_mantenimiento', 'mantenimiento.id', '=', 'equipo_mantenimiento.mantenimiento_id')
            ->leftJoin('equipos', 'equipo_mantenimiento.equipo_id', '=', 'equipos.id')
            ->select(
                'mantenimiento.*',
                'equipos.Nombre_Producto as nombre_equipo',
                'equipos.Codigo_Barras as codigo_barras',
                'equipos.proceso_compra_id',
                'equipos.Tipo_Equipo as tipo_equipo'
            )
            ->get();
    
        return response()->json($mantenimientos);
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
    public function updateDetalles(Request $request, $id)
    {
        // Validación de los datos de entrada
        $validatedData = $request->validate([
            'id'=> 'required|integer',
            'codigo_mantenimiento' => 'required|string|max:20',
            'tipo' => 'required|string|max:50',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'proveedor' => 'nullable|string|max:100',
            'contacto_proveedor' => 'nullable|string|max:100',
            'costo' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
            'estado' => 'required|string|in:Terminado,No Terminado',
            'equipos' => 'required|array',
            'equipos.*.id' => 'required|exists:equipos,id',
            'equipos.*.componentes' => 'nullable|array',
            'equipos.*.componentes.*.id' => 'required|exists:componentes,id',
            'equipos.*.componentes.*.cantidad' => 'required|integer|min:1',
            'actividades' => 'required|array',
            'actividades.*.id' => 'required|exists:actividades,id',
            'actividades.*.nombre' => 'required|string|max:255',
        ]);
    
        // Buscar el mantenimiento a actualizar
        $mantenimiento = Mantenimiento::findOrFail($id);
    
        // Actualizar los datos principales del mantenimiento
        $mantenimiento->update([
            'codigo_mantenimiento' => $validatedData['codigo_mantenimiento'],
            'tipo' => $validatedData['tipo'],
            'fecha_inicio' => $validatedData['fecha_inicio'],
            'fecha_fin' => $validatedData['fecha_fin'],
            'proveedor' => $validatedData['proveedor'],
            'contacto_proveedor' => $validatedData['contacto_proveedor'],
            'costo' => $validatedData['costo'],
            'observaciones' => $validatedData['observaciones'],
            'estado' => $validatedData['estado'],
        ]);
    
        // Actualizar los equipos y sus componentes
        foreach ($validatedData['equipos'] as $equipoData) {
            $equipo = Equipo::findOrFail($equipoData['id']);
    
            // Limpiar los componentes actuales del equipo en este mantenimiento
            EquipoComponente::where('equipo_mantenimiento_id', $equipo->id)
                ->where('mantenimiento_id', $mantenimiento->id)
                ->delete();
    
            // Agregar los nuevos componentes para el equipo
            if (!empty($equipoData['componentes'])) {
                foreach ($equipoData['componentes'] as $componenteData) {
                    EquipoComponente::create([
                        'equipo_mantenimiento_id' => $equipo->id,
                        'mantenimiento_id' => $validatedData['id'],
                        'componente_id' => $componenteData['id'],
                        'cantidad' => $componenteData['cantidad'],
                    ]);
                }
            }
        }
    
        // Actualizar las actividades
        foreach ($validatedData['actividades'] as $actividadData) {
            $actividad = Actividad::findOrFail($actividadData['id']);
            $actividad->update([
                'nombre' => $actividadData['nombre'],
            ]);
        }
    
        // Devuelve una respuesta con el mantenimiento actualizado
        return response()->json([
            'message' => 'Mantenimiento actualizado correctamente',
            'mantenimiento' => $mantenimiento->load('equipos.componentes', 'actividades'),
        ], 200);
    }
   
    public function update(Request $request, $id)
{
    $mantenimiento = Mantenimiento::findOrFail($id);

    // Actualizar los campos del mantenimiento
    $mantenimiento->update($request->only([
        'codigo_mantenimiento',
        'tipo',
        'fecha_inicio',
        'fecha_fin',
        'proveedor',
        'contacto_proveedor',
        'costo',
        'observaciones',
    ]));

    // Actualizar las actividades
    if ($request->has('actividades')) {
        $actividadIds = collect($request->input('actividades'))->pluck('id');
        $mantenimiento->actividades()->sync($actividadIds);
    }

    // Actualizar los equipos
    if ($request->has('equipos')) {
        $equipoIds = collect($request->input('equipos'))->pluck('id');
        $mantenimiento->equipos()->sync($equipoIds);
    }

    return response()->json([
        'message' => 'Mantenimiento actualizado con éxito',
        'mantenimiento' => $mantenimiento->load(['actividades', 'equipos']),
    ]);
}
public function showMantenimientoDetalles($id)
{
    // Obtener el mantenimiento con sus datos básicos
    $mantenimiento = DB::table('mantenimiento')
    ->select('mantenimiento.*') // Esto incluirá todas las columnas, incluido 'estado'
    ->where('id', $id)
    ->first();

    if (!$mantenimiento) {
        return response()->json(['error' => 'Mantenimiento no encontrado'], 404);
    }

    // Obtener los equipos asociados al mantenimiento
    $equipos = DB::table('equipos')
        ->join('equipo_componentes', 'equipos.id', '=', 'equipo_componentes.equipo_mantenimiento_id')
        ->where('equipo_componentes.mantenimiento_id', $id)
        ->select('equipos.*')
        ->distinct()
        ->get();

    // Para cada equipo, obtener sus componentes
    $equiposConComponentes = $equipos->map(function ($equipo) use ($id) {
        $componentes = DB::table('componentes')
            ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
            ->where('equipo_componentes.equipo_mantenimiento_id', $equipo->id)
            ->where('equipo_componentes.mantenimiento_id', $id)
            ->select('componentes.*', 'equipo_componentes.cantidad')
            ->get();

        $equipo->componentes = $componentes;
        return $equipo;
    });

    // Obtener las actividades asociadas al mantenimiento
    $actividades = DB::table('actividades')
        ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
        ->where('mantenimiento_actividad.mantenimiento_id', $id)
        ->select('actividades.*')
        ->get();

    // Combinar los datos del mantenimiento, equipos y actividades en un solo array
    $response = (array) $mantenimiento;
    $response['equipos'] = $equiposConComponentes;
    $response['actividades'] = $actividades;

    return response()->json($response);
}

public function updateEstado(Request $request, $id)
{
    try {
        $request->validate([
            'estado' => 'required|in:Terminado,No Terminado',
        ]);

        $mantenimiento = Mantenimiento::findOrFail($id);
        $estadoAnterior = $mantenimiento->estado;
        $mantenimiento->estado = $request->estado;
        $mantenimiento->save();

        Log::info("Estado actualizado para mantenimiento ID: $id. Anterior: $estadoAnterior, Nuevo: {$mantenimiento->estado}");

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'estado' => $mantenimiento->estado,
            'estadoAnterior' => $estadoAnterior
        ]);
    } catch (\Exception $e) {
        Log::error('Error al actualizar estado: ' . $e->getMessage());
        return response()->json([
            'message' => 'Error al actualizar el estado',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
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
