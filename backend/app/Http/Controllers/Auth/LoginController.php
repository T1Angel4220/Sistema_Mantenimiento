<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;  // Importar la clase Validator
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Validar las credenciales
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Credenciales inválidas'], 400); // Mejor mensaje para credenciales inválidas
        }

        // Intentar autenticar al usuario
        if ($token = JWTAuth::attempt($request->only('email', 'password'))) {
            // Si es exitoso, retornar el token
            return response()->json(['token' => $token]);
        }

        // Si las credenciales no son correctas, un mensaje más claro
        return response()->json(['error' => 'Correo o contraseña incorrectos'], 401);
    }
}
