<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\EquipoController;
use App\Http\Controllers\MantenimientoController; // Importa el controlador para los mantenimientos

// Rutas de registro y login
Route::post('/register', [RegisterController::class, 'register']);
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('me', [AuthController::class, 'me'])->middleware('auth:api');
Route::post('login', [LoginController::class, 'login']);

// Rutas de equipos
Route::controller(EquipoController::class)->group(function(){
    Route::get('/equipos','index');
    Route::post('/equipo','store');
    Route::get('/equipo/{id}','show');
    Route::put('/equipo/{id}','update');
    Route::delete('/equipo/{id}','destroy');
});


// Rutas para manejar los mantenimientos
Route::controller(MantenimientoController::class)->group(function(){
    Route::get('/mantenimientos', 'index'); // Obtener todos los mantenimientos
    Route::get('/mantenimientos/{id}', 'show'); // Obtener mantenimiento específico por ID
    Route::delete('/mantenimientos/{id}', 'destroy');
});
