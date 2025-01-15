<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User; // Asegúrate de importar el modelo User
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // Importar la clase Validator
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\UsuarioActivo;  // Asegúrate de importar el modelo

class LoginController extends Controller
{
   
public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (!$token = Auth::attempt($credentials)) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Obtener el usuario autenticado
    $user = Auth::user();

    // Guardar o actualizar el usuario en la tabla usuario_activo
    $usuarioActivo = UsuarioActivo::updateOrCreate(
        ['email' => $user->email],  // Usamos el email para identificar al usuario
        [
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email_verified_at' => $user->email_verified_at,
            'password' => $user->password,
            'remember_token' => $user->remember_token,
            'created_at' => now(),
            'updated_at' => now(),
        ]
    );

    return response()->json(['token' => $token]);
}
}
