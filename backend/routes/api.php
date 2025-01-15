<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\EquipoController;
use App\Http\Controllers\EquipoImportController;
use App\Http\Controllers\ProcesoCompraController;
use App\Http\Controllers\MantenimientoController;
use App\Http\Controllers\ActivoController;
use App\Http\Controllers\ComponenteController;
use App\Http\Controllers\ActividadController;
use App\Http\Controllers\EquipoComponenteController;
use Illuminate\Support\Facades\DB;

Route::get('/mantenimientos/{id}', [MantenimientoController::class, 'show']);
Route::get('/mantenimiento-actividad/{id}/{equipoId}', function ($id, $equipoId) {
    return DB::table('mantenimiento_actividad')
        ->join('actividades', 'mantenimiento_actividad.actividad_id', '=', 'actividades.id')
        ->where('mantenimiento_actividad.mantenimiento_id', $id)
        ->where('mantenimiento_actividad.equipo_id', $equipoId)
        ->select('actividades.*')
        ->get();
});
Route::get('/equipo-componentes/{id}', function ($id) {
    return DB::table('equipo_componentes')
        ->join('componentes', 'equipo_componentes.componente_id', '=', 'componentes.id')
        ->join('equipo_mantenimiento', 'equipo_componentes.equipo_mantenimiento_id', '=', 'equipo_mantenimiento.id')
        ->where('equipo_mantenimiento.mantenimiento_id', $id)
        ->select('componentes.*', 'equipo_componentes.cantidad')
        ->get();
});
Route::get('/mantenimiento-equipos/{id}', function ($id) {
    return DB::table('mantenimiento_equipos')
        ->join('equipos', 'mantenimiento_equipos.equipo_id', '=', 'equipos.id')
        ->where('mantenimiento_equipos.mantenimiento_id', $id)
        ->select('equipos.*')
        ->get();
});

Route::controller(ActividadController::class)->group(function () {
    Route::get('/actividades', 'index');
    Route::post('/actividades', 'store');
    Route::get('/actividades/{id}', 'show');
    Route::put('/actividades/{id}', 'update');
    Route::delete('/actividades/{id}', 'destroy');
});

Route::get('/proveedores', [MantenimientoController::class, 'getProveedores']);

Route::controller(ComponenteController::class)->group(function () {
    Route::get('/componentes', 'index');
    Route::post('/componentes', 'store');
    Route::get('/componentes/{id}', 'show');
    Route::put('/componentes/{id}', 'update');
    Route::delete('/componentes/{id}', 'destroy');
});

Route::controller(EquipoComponenteController::class)->group(function () {
    Route::get('/componentesEquipos', 'index');
    Route::post('/componentesEquipos', 'store');
});

Route::post('/proceso-compra', [ProcesoCompraController::class, 'store']);
Route::get('/proceso-compra', [ProcesoCompraController::class, 'index']);

Route::controller(MantenimientoController::class)->group(function () {
    Route::get('/mantenimientos', 'index');
    Route::put('/mantenimientosDetalles', 'guardarMantenimiento');
    Route::post('/mantenimientosDetalles', 'store');
    Route::get('/mantenimientos/{id}', 'showMantenimientoDetalles');
    Route::put('/mantenimientos/{id}', 'update');

    Route::delete('/mantenimientos/{id}', 'destroy');
    Route::get('/mantenimientos_idMax', 'obtenerIdMaximo');
    Route::get('/mantenimientoDetalles/{id}', 'showMantenimientoDetalles');
});
Route::get('/historial-equipo/{id}', function ($id) {
    return DB::table('equipo_mantenimiento')
        ->join('mantenimiento', 'equipo_mantenimiento.mantenimiento_id', '=', 'mantenimiento.id')
        ->where('equipo_mantenimiento.equipo_id', $id)
        ->select(
            'mantenimiento.id',
            'mantenimiento.codigo_mantenimiento',
            'mantenimiento.tipo',
            'mantenimiento.fecha_inicio',
            'mantenimiento.fecha_fin',
            'mantenimiento.estado',
            'mantenimiento.proveedor',
            'mantenimiento.contacto_proveedor',
            'mantenimiento.costo'
        )
        ->get();
});
Route::get('/historial-componentes/{equipoId}', function ($equipoId) {
    $componentes = DB::table('equipo_componentes as ec')
        ->leftJoin('equipo_mantenimiento as em', 'ec.equipo_mantenimiento_id', '=', 'em.id')
        ->leftJoin('componentes as c', 'ec.componente_id', '=', 'c.id')
        ->where('em.equipo_id', $equipoId)
        ->orWhereNull('em.equipo_id') // Incluye registros sin relación en equipo_mantenimiento
        ->select(
            'ec.id as equipo_componente_id',
            'ec.cantidad',
            'ec.mantenimiento_id',
            'em.equipo_id',
            'c.nombre as componente_nombre'
        )
        ->get();
    return response()->json($componentes);
});
Route::post('/equipos/import', [EquipoImportController::class, 'import']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');

Route::controller(EquipoController::class)->group(function () {
    Route::get('/equipos', 'index');
    Route::post('/equipo', 'store');
    Route::get('/equipo/{id}', 'show');
    Route::put('/equipo/{id}', 'update');
    Route::delete('/equipo/{id}', 'destroy');
    Route::post('/equipoDisponibles', 'obtenerEquiposDisponibles');
    Route::post('/equiposDisponiblesFiltros', 'equiposDisponiblesFiltros');

    Route::get('/equiposComponentes/{id}', 'obtenerComponentesDeEquipo');
});

Route::prefix('equipo-componentes')->group(function () {
    Route::get('/{equipoMantenimientoId}', [EquipoComponenteController::class, 'index']);
    Route::post('/', [EquipoComponenteController::class, 'store']);
    Route::put('/{id}', [EquipoComponenteController::class, 'update']);
    Route::delete('/{id}', [EquipoComponenteController::class, 'destroy']);
});

Route::get('/procesos-compra', [ProcesoCompraController::class, 'index']);
Route::post('/equipo', [EquipoController::class, 'store']);
Route::put('mantenimientos/{id}/estado', [MantenimientoController::class, 'updateEstado']);
Route::get('/lista-mantenimientos', [MantenimientoController::class, 'getListaMantenimientos']);


Route::get('/equipos-mantenimiento', function () {
    return DB::table('equipos')
        ->join('equipo_mantenimiento', 'equipos.id', '=', 'equipo_mantenimiento.equipo_id')
        ->select('equipos.id', 'equipos.Nombre_Producto as nombre')
        ->distinct()
        ->get();
});

Route::get('/mantenimientos', [MantenimientoController::class, 'index']);
Route::get('/lista-mantenimientos', [MantenimientoController::class, 'getListaMantenimientos']);
Route::put('/mantenimientos/{id}', [MantenimientoController::class, 'updateDetalles']);
