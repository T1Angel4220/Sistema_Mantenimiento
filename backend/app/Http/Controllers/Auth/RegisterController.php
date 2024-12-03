<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',        // Cambié 'first_name' por 'name'
            'lastname' => 'required|string|max:255',   // Cambié 'last_name' por 'lastname'
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:7|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Crear el usuario
        $user = User::create([
            'name' => $request->name,        // Cambié 'first_name' por 'name'
            'lastname' => $request->lastname, // Cambié 'last_name' por 'lastname'
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Retornar una respuesta exitosa
        return response()->json(['message' => 'Usuario registrado exitosamente', 'user' => $user], 201);
    }
}
