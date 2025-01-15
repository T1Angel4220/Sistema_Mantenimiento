<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\UsuarioActivo; 
use Illuminate\Support\Facades\DB;
 // Asegúrate de importar el modelo

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([

            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:7',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'lastname' => $validatedData['lastname'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(['token' => $token], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
    
        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        // Obtener el usuario autenticado
        $user = DB::table('users')->where('email', $credentials['email'])->first();    
        DB::table('usuario_activo')->truncate();
        DB::table('usuario_activo')->insert([
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email' => $user->email, // Asegúrate de insertar también el email para identificación
        ]);
    
        return response()->json(['token' => $token]);
    }



    public function me()
    {
        $user=session('user');
        return response()->json($user);
    }
}
