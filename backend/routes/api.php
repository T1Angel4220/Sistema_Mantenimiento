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
Route::get('/mantenimiento-actividad/{id}', [MantenimientoController::class, 'getActividades']);
Route::get('/equipo-componentes/{id}', [MantenimientoController::class, 'getComponentes']);
Route::get('/mantenimiento-equipos/{id}', [MantenimientoController::class, 'getEquipos']);


// Get activities for a maintenance
Route::get('/mantenimiento-actividad/{id}', function ($id) {
    return DB::table('mantenimiento_actividad')
        ->join('actividades', 'mantenimiento_actividad.actividad_id', '=', 'actividades.id')
        ->where('mantenimiento_actividad.mantenimiento_id', $id)
        ->select('actividades.*')
        ->get();
});

// Get components for a maintenance
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
    Route::post('/componentesEquipos',  'store');
});

Route::post('/proceso-compra', [ProcesoCompraController::class, 'store']);


Route::get('/proceso-compra', [ProcesoCompraController::class, 'index']);
Route::post('/proceso-compra', [ProcesoCompraController::class, 'store']);



Route::controller(MantenimientoController::class)->group(function () {
    Route::get('/mantenimientos', 'index');
    Route::post('/mantenimientos', 'store');
    Route::get('/mantenimientos/{id}', 'show');
    Route::put('/mantenimientos/{id}', 'update');
    Route::delete('/mantenimientos/{id}', 'destroy');
    Route::get('/mantenimientos_idMax', 'obtenerIdMaximo');
    
});

Route::post('/equipos/import', [EquipoImportController::class, 'import']);


Route::post('/register', [RegisterController::class, 'register']);

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
Route::post('login', [LoginController::class, 'login']);

Route::controller(EquipoController::class)->group(function(){
    Route::get('/equipos','index');
    Route::post('/equipo','store');
    Route::get('/equipo/{id}','show');
    Route::put('/equipo/{id}','update');
    Route::delete('/equipo/{id}','destroy');
    Route::post('/equipoDisponibles','obtenerEquiposDisponibles');
    Route::get('/equiposComponentes/{id}','obtenerComponentesDeEquipo');
});
Route::delete('/equipos-componentes/{equipoMantenimientoId}/{componenteId}', [EquipoComponenteController::class, 'destroy']);
Route::post('/equipos-componentes/{equipoMantenimientoId}', [EquipoComponenteController::class, 'store']);

Route::prefix('equipo-componentes')->group(function () {
    Route::get('/{equipoMantenimientoId}', [EquipoComponenteController::class, 'index']);
    Route::post('/{equipoMantenimientoId}', [EquipoComponenteController::class, 'store']);
    Route::post('/AniadirComponentes', [EquipoComponenteController::class, 'create']);  //Endpoint Añadido
    Route::put('/{id}', [EquipoComponenteController::class, 'update']);
    Route::delete('/{id}', [EquipoComponenteController::class, 'destroy']);
});
Route::post('/componentesEquipos', [EquipoComponenteController::class, 'store']);


