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

Route::post('/proceso-compra', [ProcesoCompraController::class, 'store']);


Route::get('/proceso-compra', [ProcesoCompraController::class, 'index']);
Route::post('/proceso-compra', [ProcesoCompraController::class, 'store']);



Route::controller(MantenimientoController::class)->group(function () {
    Route::get('/mantenimientos', 'index');
    Route::post('/mantenimientos', 'store');
    Route::get('/mantenimientos/{id}', 'show');
    Route::put('/mantenimientos/{id}', 'update');
    Route::delete('/mantenimientos/{id}', 'destroy');
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
});