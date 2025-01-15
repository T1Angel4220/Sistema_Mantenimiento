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
use App\Models\Componente;
use App\Models\ObservacionMantenimiento;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth; // Para usar auth()->user()

class MantenimientoController extends Controller
{

    
    public function getReportes(Request $reporteRequest)
    {
        if ($reporteRequest['tipo_reporte'] === 'anual') {
            // Mantenimientos Iniciados
            $mantenimientosIniciados = Mantenimiento::whereYear('fecha_inicio', $reporteRequest['anio'])->count();
            
            // Mantenimientos Terminados
            $mantenimientosTerminados = Mantenimiento::whereYear('fecha_fin', $reporteRequest['anio'])
                ->whereNotNull('fecha_fin')
                ->count();
            
            // Mantenimientos en Proceso (sin fecha de fin)
            $mantenimientosEnProceso = Mantenimiento::whereYear('fecha_inicio', $reporteRequest['anio'])
                ->whereNull('fecha_fin')
                ->count();
        } elseif ($reporteRequest['tipo_reporte'] === 'mensual') {
            // Mantenimientos Iniciados
            $mantenimientosIniciados = Mantenimiento::whereYear('fecha_inicio', $reporteRequest['anio'])
                ->whereMonth('fecha_inicio', $reporteRequest['mes'])
                ->count();
            
            // Mantenimientos Terminados
            $mantenimientosTerminados = Mantenimiento::whereYear('fecha_fin', $reporteRequest['anio'])
                ->whereMonth('fecha_fin', $reporteRequest['mes'])
                ->whereNotNull('fecha_fin')
                ->count();
            
            // Mantenimientos en Proceso (sin fecha de fin)
            $mantenimientosEnProceso = Mantenimiento::whereYear('fecha_inicio',$reporteRequest['anio'])
                ->whereMonth('fecha_inicio', $reporteRequest['mes'])
                ->whereNull('fecha_fin')
                ->count();
        } elseif ($reporteRequest['tipo_reporte'] === 'personalizado') {
            // Mantenimientos Iniciados
            $mantenimientosIniciados = Mantenimiento::whereBetween('fecha_inicio', [$reporteRequest['fecha_inicio'], $reporteRequest['fecha_fin']])->count();
            
            // Mantenimientos Terminados
            $mantenimientosTerminados = Mantenimiento::whereBetween('fecha_fin', [$reporteRequest['fecha_inicio'], $reporteRequest['fecha_fin']])
                ->whereNotNull('fecha_fin')
                ->count();
            
            // Mantenimientos en Proceso (sin fecha de fin)
            $mantenimientosEnProceso = Mantenimiento::whereBetween('fecha_inicio', [$reporteRequest['fecha_inicio'],$reporteRequest['fecha_fin']])
                ->whereNull('fecha_fin')
                ->count();
        }
        $tipoReporte = $reporteRequest['tipo_reporte'];
        
        // Consultas para obtener los datos
        switch ($tipoReporte) {
            case 'anual':
                return $this->getReporteAnual($reporteRequest['anio'], $mantenimientosIniciados,$mantenimientosTerminados,  $mantenimientosEnProceso);
                
            case 'mensual':
                return $this->getReporteMensual($reporteRequest['anio'], $reporteRequest['mes'], $mantenimientosIniciados,$mantenimientosTerminados,  $mantenimientosEnProceso);
                
            case 'personalizado':
                return $this->getReportePersonalizado($reporteRequest['fecha_inicio'], $reporteRequest['fecha_fin'], $mantenimientosIniciados,$mantenimientosTerminados,  $mantenimientosEnProceso);
                
            default:
                return response()->json(['error' => 'Tipo de reporte no válido'], 400);
        }
    }

    private function getReporteAnual($anio, $mantenimientosIniciados,$mantenimientosTerminados,  $mantenimientosEnProceso)
    {
        // Obtener el total de mantenimientos por mes en el año especificado
        $mantenimientosPorMes = DB::table('mantenimiento')
            ->select(DB::raw('EXTRACT(MONTH FROM fecha_inicio) as mes'), DB::raw('COUNT(*) as cantidad'))
            ->whereYear('fecha_inicio', $anio)
            ->groupBy(DB::raw('EXTRACT(MONTH FROM fecha_inicio)'))
            ->orderBy(DB::raw('EXTRACT(MONTH FROM fecha_inicio)'))
            ->get();

        // Obtener los equipos que han tenido mantenimiento
        $equipos = DB::table('equipos')
            ->join('mantenimiento_actividad', 'equipos.id', '=', 'mantenimiento_actividad.equipo_id')
            ->join('mantenimiento', 'mantenimiento_actividad.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereYear('mantenimiento.fecha_inicio', $anio)
            ->select('equipos.id', 'equipos.Nombre_Producto', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('equipos.id', 'equipos.Nombre_Producto')
            ->get();

        // Obtener las actividades usadas en los mantenimientos
        $actividades = DB::table('actividades')
            ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
            ->join('mantenimiento', 'mantenimiento_actividad.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereYear('mantenimiento.fecha_inicio', $anio)
            ->select('actividades.id', 'actividades.nombre', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('actividades.id', 'actividades.nombre')
            ->get();

        // Obtener los componentes usados en los mantenimientos
        $componentes = DB::table('componentes')
            ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
            ->join('mantenimiento', 'equipo_componentes.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereYear('mantenimiento.fecha_inicio', $anio)
            ->select('componentes.id', 'componentes.nombre', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('componentes.id', 'componentes.nombre')
            ->get();

        return [
            'mantenimientos_iniciados' => $mantenimientosIniciados,
            'mantenimientos_terminados' => $mantenimientosTerminados,
            'mantenimientos_en_proceso' => $mantenimientosEnProceso,
            'mantenimientos_por_mes' => $mantenimientosPorMes,
            'equipos' => $equipos,
            'actividades' => $actividades,
            'componentes' => $componentes
        ];
    }

    private function getReporteMensual($anio, $mes, $mantenimientosIniciados,$mantenimientosTerminados,  $mantenimientosEnProceso)
    {
        // Obtener el total de mantenimientos del mes
        $mantenimientos = DB::table('mantenimiento')
            ->whereYear('fecha_inicio', $anio)
            ->whereMonth('fecha_inicio', $mes)
            ->count();

        // Obtener los equipos que han tenido mantenimiento en ese mes
        $equipos = DB::table('equipos')
            ->join('mantenimiento_actividad', 'equipos.id', '=', 'mantenimiento_actividad.equipo_id')
            ->join('mantenimiento', 'mantenimiento_actividad.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereYear('mantenimiento.fecha_inicio', $anio)
            ->whereMonth('mantenimiento.fecha_inicio', $mes)
            ->select('equipos.id', 'equipos.Nombre_Producto', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('equipos.id', 'equipos.Nombre_Producto')
            ->get();

        // Obtener las actividades usadas en los mantenimientos en ese mes
        $actividades = DB::table('actividades')
            ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
            ->join('mantenimiento', 'mantenimiento_actividad.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereYear('mantenimiento.fecha_inicio', $anio)
            ->whereMonth('mantenimiento.fecha_inicio', $mes)
            ->select('actividades.id', 'actividades.nombre', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('actividades.id', 'actividades.nombre')
            ->get();

        // Obtener los componentes usados en los mantenimientos en ese mes
        $componentes = DB::table('componentes')
            ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
            ->join('mantenimiento', 'equipo_componentes.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereYear('mantenimiento.fecha_inicio', $anio)
            ->whereMonth('mantenimiento.fecha_inicio', $mes)
            ->select('componentes.id', 'componentes.nombre', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('componentes.id', 'componentes.nombre')
            ->get();

        return [
            'mantenimientos_iniciados' => $mantenimientosIniciados,
            'mantenimientos_terminados' => $mantenimientosTerminados,
            'mantenimientos_en_proceso' => $mantenimientosEnProceso,
            'mantenimientos' => $mantenimientos,
            'equipos' => $equipos,
            'actividades' => $actividades,
            'componentes' => $componentes
        ];
    }

    private function getReportePersonalizado($fechaInicio, $fechaFin, $mantenimientosIniciados,$mantenimientosTerminados,  $mantenimientosEnProceso)
    {
        // Obtener mantenimientos entre las fechas proporcionadas
        $mantenimientos = DB::table('mantenimiento')
            ->whereBetween('fecha_inicio', [$fechaInicio, $fechaFin])
            ->count();

        // Obtener los equipos que han tenido mantenimiento en el rango de fechas
        $equipos = DB::table('equipos')
            ->join('mantenimiento_actividad', 'equipos.id', '=', 'mantenimiento_actividad.equipo_id')
            ->join('mantenimiento', 'mantenimiento_actividad.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereBetween('mantenimiento.fecha_inicio', [$fechaInicio, $fechaFin])
            ->select('equipos.id', 'equipos.Nombre_Producto', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('equipos.id', 'equipos.Nombre_Producto')
            ->get();

        // Obtener las actividades usadas en los mantenimientos en el rango de fechas
        $actividades = DB::table('actividades')
            ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
            ->join('mantenimiento', 'mantenimiento_actividad.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereBetween('mantenimiento.fecha_inicio', [$fechaInicio, $fechaFin])
            ->select('actividades.id', 'actividades.nombre', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('actividades.id', 'actividades.nombre')
            ->get();

        // Obtener los componentes usados en los mantenimientos en el rango de fechas
        $componentes = DB::table('componentes')
            ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
            ->join('mantenimiento', 'equipo_componentes.mantenimiento_id', '=', 'mantenimiento.id')
            ->whereBetween('mantenimiento.fecha_inicio', [$fechaInicio, $fechaFin])
            ->select('componentes.id', 'componentes.nombre', DB::raw('COUNT(mantenimiento.id) as cantidad'))
            ->groupBy('componentes.id', 'componentes.nombre')
            ->get();

        return [
            'mantenimientos_iniciados' => $mantenimientosIniciados,
            'mantenimientos_terminados' => $mantenimientosTerminados,
            'mantenimientos_en_proceso' => $mantenimientosEnProceso,
            'mantenimientos' => $mantenimientos,
            'equipos' => $equipos,
            'actividades' => $actividades,
            'componentes' => $componentes
        ];
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
    // Validar los datos del request
    $data = $request->validate([
        'codigo_mantenimiento' => 'required|string|max:255',
        'tipo' => 'required|string|max:255',
        'fecha_inicio' => 'required|date',
        'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        'proveedor' => 'nullable|string|max:255',
        'contacto_proveedor' => 'nullable|string|max:255',
        'costo' => 'nullable|numeric',
        'equipos' => 'required|array',
        'equipos.*.id' => 'required|integer|exists:equipos,id',
        'equipos.*.actividades' => 'array',
        'equipos.*.actividades.*.id' => 'integer|exists:actividades,id',
        'equipos.*.componentes' => 'array',
        'equipos.*.componentes.*.id' => 'integer|exists:componentes,id',
    ]);

    // Obtener el único usuario activo desde la tabla 'usuario_activo'
    $user = DB::table('usuario_activo')->first(); 

    // Verificar si existe un registro en 'usuario_activo'
    if (!$user) {
        return response()->json(['error' => 'No hay un usuario activo registrado'], 404);
    }

    // Crear el mantenimiento
    $mantenimientoId = DB::table('mantenimiento')->insertGetId([
        'codigo_mantenimiento' => $data['codigo_mantenimiento'],
        'tipo' => $data['tipo'],
        'fecha_inicio' => $data['fecha_inicio'],
        'fecha_fin' => $data['fecha_fin'],
        'proveedor' => $data['proveedor'],
        'contacto_proveedor' => $data['contacto_proveedor'],
        'costo' => $data['costo'],
        'nombre_responsable' => $user->name, // Guardar el nombre del usuario activo
        'apellido_responsable' => $user->lastname, // Guardar el apellido del usuario activo
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Asociar equipos, actividades y componentes al mantenimiento
    foreach ($data['equipos'] as $equipo) {
        // Asociar equipo al mantenimiento
        DB::table('equipo_mantenimiento')->insert([
            'mantenimiento_id' => $mantenimientoId,
            'equipo_id' => $equipo['id'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Asociar actividades al mantenimiento y equipo
        if (!empty($equipo['actividades'])) {
            foreach ($equipo['actividades'] as $actividad) {
                DB::table('mantenimiento_actividad')->insert([
                    'mantenimiento_id' => $mantenimientoId,
                    'equipo_id' => $equipo['id'],
                    'actividad_id' => $actividad['id'],
                   // Guardar el apellido del usuario activo
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Asociar componentes al equipo y mantenimiento
        if (!empty($equipo['componentes'])) {
            foreach ($equipo['componentes'] as $componente) {
                DB::table('equipo_componentes')->insert([
                    'mantenimiento_id' => $mantenimientoId,
                    'equipo_mantenimiento_id' => $equipo['id'],
                    'componente_id' => $componente['id'],
                    'cantidad' => $componente['cantidad'] ?? 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    return response()->json(['success' => 'Mantenimiento creado exitosamente', 'mantenimiento_id' => $mantenimientoId], 201);
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
    public function index(Request $request)
    {
        // Start with the base query
        $query = DB::table('mantenimiento')
            ->select('mantenimiento.*')
            ->distinct();

    // Apply date filters to include only maintenances that fall entirely within the specified range
    if ($request->filled('fechaInicio') && $request->filled('fechaFin')) {
        $query->where(function($q) use ($request) {
            $q->where('fecha_inicio', '>=', $request->fechaInicio)
              ->where('fecha_fin', '<=', $request->fechaFin);
        });
    } elseif ($request->filled('fechaInicio')) {
        // If only one date is provided, find maintenances active on that date
        $query->where(function($q) use ($request) {
            $q->where('fecha_inicio', '<=', $request->fechaInicio)
              ->where('fecha_fin', '>=', $request->fechaInicio);
        });
    }

        // Add specific filter for maintenance code
        if ($request->filled('tipo')) {
            $query->where('mantenimiento.codigo_mantenimiento', $request->tipo);
        }

        if ($request->filled('estado')) {
            $query->where('mantenimiento.estado', $request->estado);
        }

        if ($request->filled('equipo')) {
            $query->join('equipo_mantenimiento', 'mantenimiento.id', '=', 'equipo_mantenimiento.mantenimiento_id')
                  ->where('equipo_mantenimiento.equipo_id', $request->equipo);
        }

        if ($request->filled('actividad')) {
            $query->join('mantenimiento_actividad', 'mantenimiento.id', '=', 'mantenimiento_actividad.mantenimiento_id')
                  ->where('mantenimiento_actividad.actividad_id', $request->actividad);
        }

        if ($request->filled('tipoActivo')) {
            $query->where('mantenimiento.tipo', $request->tipoActivo);
        }

        if ($request->filled('componente')) {
            $query->join('equipo_componentes', 'mantenimiento.id', '=', 'equipo_componentes.mantenimiento_id')
                  ->join('componentes', 'equipo_componentes.componente_id', '=', 'componentes.id')
                  ->where('componentes.id', $request->componente);
        }

        // Get the filtered mantenimientos
        $mantenimientos = $query->orderBy('mantenimiento.updated_at', 'desc')->get();

        // Si no hay mantenimientos, devolver array vacío en lugar de error
        if ($mantenimientos->isEmpty()) {
            return response()->json([]);
        }

        // Para cada mantenimiento, obtener los equipos asociados
        $mantenimientosConEquipos = $mantenimientos->map(function ($mantenimiento) {
            // Obtener los equipos asociados al mantenimiento
            $equipos = DB::table('equipos')
                ->join('equipo_mantenimiento', 'equipos.id', '=', 'equipo_mantenimiento.equipo_id')
                ->where('equipo_mantenimiento.mantenimiento_id', $mantenimiento->id)
                ->select('equipos.*')
                ->get();

            // Para cada equipo, obtener sus componentes y actividades
            $equiposConComponentesYActividades = $equipos->map(function ($equipo) use ($mantenimiento) {
                // Obtener los componentes
                $componentes = DB::table('componentes')
                    ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
                    ->where('equipo_componentes.equipo_mantenimiento_id', $equipo->id)
                    ->where('equipo_componentes.mantenimiento_id', $mantenimiento->id)
                    ->select('componentes.*', 'equipo_componentes.cantidad')
                    ->distinct()
                    ->get();

                $equipo->componentes = $componentes;

                // Obtener las actividades
                $actividades = DB::table('actividades')
                    ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
                    ->where('mantenimiento_actividad.mantenimiento_id', $mantenimiento->id)
                    ->where('mantenimiento_actividad.equipo_id', $equipo->id)
                    ->select('actividades.*')
                    ->distinct()
                    ->get();

                $equipo->actividades = $actividades;

                return $equipo;
            });

            $mantenimiento->equipos = $equiposConComponentesYActividades;

            return $mantenimiento;
        });

        return response()->json($mantenimientosConEquipos);
    }
    public function getListaMantenimientos()
{
    // Obtener todos los mantenimientos
    $mantenimientos = DB::table('mantenimiento')
        ->select('id', 'codigo_mantenimiento')
        ->orderBy('codigo_mantenimiento', 'asc')
        ->get();

    return response()->json($mantenimientos);
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
            'estado' => 'required|string|in:Terminado,No terminado',
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
    
        // Eliminar las actividades anteriores asociadas con el mantenimiento
        $mantenimiento->actividades()->detach();
    
        // Agregar las nuevas actividades
        foreach ($validatedData['actividades'] as $actividadData) {
            // Asocia las nuevas actividades al mantenimiento
            $mantenimiento->actividades()->attach($actividadData['id']);
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
        ->select('mantenimiento.*')
        ->where('id', $id)
        ->first();

    if (!$mantenimiento) {
        return response()->json(['error' => 'Mantenimiento no encontrado'], 404);
    }

    // Obtener los equipos asociados al mantenimiento desde la tabla equipo_mantenimiento
    $equipos = DB::table('equipos')
        ->join('equipo_mantenimiento', 'equipos.id', '=', 'equipo_mantenimiento.equipo_id')
        ->where('equipo_mantenimiento.mantenimiento_id', $id)
        ->select('equipos.*', 'equipo_mantenimiento.observacion') // Aseguramos que la observación se incluya
        ->get();

    // Para cada equipo, obtener sus componentes sin duplicados
    $equiposConComponentesYActividades = $equipos->map(function ($equipo) use ($id) {
        // Obtener los componentes asociados al equipo
        $componentes = DB::table('componentes')
            ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
            ->where('equipo_componentes.equipo_mantenimiento_id', $equipo->id)
            ->where('equipo_componentes.mantenimiento_id', $id)
            ->select('componentes.id', 'componentes.nombre', 'componentes.descripcion', 'equipo_componentes.cantidad')
            ->distinct() // Aseguramos que los componentes no se repitan
            ->get();

        // Asignar los componentes al equipo
        $equipo->componentes = $componentes;

        // Obtener las actividades únicas asociadas al mantenimiento
        $actividades = DB::table('actividades')
            ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
            ->where('mantenimiento_actividad.mantenimiento_id', $id)
            ->where('mantenimiento_actividad.equipo_id', $equipo->id) // Aseguramos que las actividades sean específicas por equipo
            ->select('actividades.id', 'actividades.nombre')
            ->distinct() // Aseguramos que las actividades no se repitan
            ->get();

        // Asignar las actividades al equipo
        $equipo->actividades = $actividades;

        // Asegurar que la observación esté disponible (si no existe, asignar una cadena vacía)
        $equipo->observacion = $equipo->observacion ?? '';

        return $equipo;
    });

    // Obtener todas las actividades del mantenimiento (sin asociarlas a un equipo)
    $actividadesGenerales = DB::table('actividades')
        ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
        ->where('mantenimiento_actividad.mantenimiento_id', $id)
        ->select('actividades.id', 'actividades.nombre')
        ->distinct()
        ->get();

    // Combinar los datos del mantenimiento, equipos y actividades en un solo array
    $response = (array) $mantenimiento;
    $response['equipos'] = $equiposConComponentesYActividades;
    $response['actividades_generales'] = $actividadesGenerales;

    return response()->json($response);
}


public function guardarMantenimiento(Request $request)
{
    $validatedData = $request->validate([
        'id' => 'required|integer',
        'estado'=>'string',
        'codigo_mantenimiento' => 'required|string|max:50',
        'fecha_fin' => 'required|date', // Validar la nueva fecha de fin
        'equipos' => 'required|array',
        'equipos.*.id' => 'required|integer',
        'equipos.*.actividades' => 'nullable|array',
        'equipos.*.actividades.*.id' => 'required_if:equipos.*.actividades,!=,[]|integer',
        'equipos.*.actividades.*.nombre' => 'required_if:equipos.*.actividades,!=,[]|string|max:100',
        'equipos.*.componentes' => 'nullable|array',
        'equipos.*.componentes.*.id' => 'required_if:equipos.*.componentes,!=,[]|integer',
        'equipos.*.componentes.*.nombre' => 'required_if:equipos.*.componentes,!=,[]|string|max:100',
        'equipos.*.componentes.*.cantidad' => 'required_if:equipos.*.componentes,!=,[]|integer',
        'equipos.*.observacion' => 'nullable|string',
    ]);

    try {
        DB::beginTransaction();

        // Encontrar el mantenimiento a actualizar
        $mantenimiento = Mantenimiento::findOrFail($validatedData['id']);

        $mantenimiento->fecha_fin = $validatedData['fecha_fin'];
        $mantenimiento->estado = $validatedData['estado'];

        $mantenimiento->save();

        // Eliminar los registros de las tablas intermedias directamente
        DB::table('mantenimiento_actividad')->where('mantenimiento_id', $mantenimiento->id)->delete();
        DB::table('equipo_componentes')->where('mantenimiento_id', $mantenimiento->id)->delete();
        DB::table('equipo_mantenimiento')->where('mantenimiento_id', $mantenimiento->id)->delete();

        // Asociar los equipos al mantenimiento
        foreach ($validatedData['equipos'] as $equipoData) {
            $equipo = Equipo::findOrFail($equipoData['id']); // Obtener el equipo actual

            // Asociar el equipo al mantenimiento
            DB::table('equipo_mantenimiento')->insert([
                'equipo_id' => $equipo->id,
                'mantenimiento_id' => $mantenimiento->id,
                'observacion' => $equipoData['observacion'] ?? null,
            ]);

            // Asociar actividades con el equipo y mantenimiento
            if (isset($equipoData['actividades']) && is_array($equipoData['actividades'])) {
                foreach ($equipoData['actividades'] as $actividadData) {
                    DB::table('mantenimiento_actividad')->insert([
                        'mantenimiento_id' => $mantenimiento->id,
                        'actividad_id' => $actividadData['id'],
                        'equipo_id' => $equipo->id,
                    ]);
                }
            }

            // Asociar componentes con el equipo y mantenimiento
            if (isset($equipoData['componentes']) && is_array($equipoData['componentes'])) {
                foreach ($equipoData['componentes'] as $componenteData) {
                    $componente = Componente::firstOrCreate(
                        ['id' => $componenteData['id']],
                        ['nombre' => $componenteData['nombre']]
                    );
                    // Asociar el componente con el equipo
                    DB::table('equipo_componentes')->insert([
                        'equipo_mantenimiento_id' => $equipo->id, // Corregido para usar 'equipo_mantenimiento_id'
                        'componente_id' => $componente->id,
                        'mantenimiento_id' => $mantenimiento->id,
                        'cantidad' => $componenteData['cantidad'] ?? 1,
                    ]);
                }
            }
        }

        DB::commit();

        return response()->json([
            'message' => 'Mantenimiento actualizado exitosamente, incluyendo la nueva fecha de fin.',
            'data' => $mantenimiento,
        ], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Ocurrió un error al actualizar el mantenimiento.',
            'error' => $e->getMessage(),
        ], 500);
    }
}





public function obtenerMantenimientoConDetalles($id)
{
    $mantenimiento = Mantenimiento::findOrFail($id);

    // Obtener los equipos asociados al mantenimiento
    $equipos = DB::table('equipos')
        ->join('equipo_mantenimiento', 'equipos.id', '=', 'equipo_mantenimiento.equipo_id')
        ->where('equipo_mantenimiento.mantenimiento_id', $id)
        ->select('equipos.*', 'equipo_mantenimiento.observacion') // Seleccionar todas las columnas de la tabla 'equipos'
        ->get();

    // Obtener las actividades y los componentes asociados a cada equipo
    foreach ($equipos as $equipo) {
        // Obtener las actividades del equipo
        $actividades = DB::table('actividades')
            ->join('mantenimiento_actividad', 'actividades.id', '=', 'mantenimiento_actividad.actividad_id')
            ->where('mantenimiento_actividad.equipo_id', $equipo->id)
            ->select('actividades.*') // Seleccionar todas las columnas de la tabla 'actividades'
            ->get();

        // Obtener los componentes del equipo
        $componentes = DB::table('componentes')
            ->join('equipo_componentes', 'componentes.id', '=', 'equipo_componentes.componente_id')
            ->where('equipo_componentes.equipo_mantenimiento_id', $equipo->id)
            ->select('componentes.*') // Seleccionar todas las columnas de la tabla 'componentes'
            ->get();

        // Agregar las actividades y componentes al equipo
        $equipo->actividades = $actividades;
        $equipo->componentes = $componentes;
    }

    // Preparar la respuesta final con todos los datos
    $response = [
        'codigo_mantenimiento' => $mantenimiento->codigo_mantenimiento,
        'tipo' => $mantenimiento->tipo,
        'fecha_inicio' => $mantenimiento->fecha_inicio,
        'fecha_fin' => $mantenimiento->fecha_fin,
        'proveedor' => $mantenimiento->proveedor,
        'contacto_proveedor' => $mantenimiento->contacto_proveedor,
        'costo' => $mantenimiento->costo,
        'equipos' => $equipos
    ];

    // Devolver la respuesta en formato JSON
    return response()->json($response);
}
public function updateEstado(Request $request, $id)
{
    try {
        $request->validate([
            'estado' => 'required|in:Terminado,No terminado',
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
