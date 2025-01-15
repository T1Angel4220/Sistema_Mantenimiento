<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear 2 usuarios manualmente
        User::create([
            'name' => 'Miguel',
            'lastname' => 'Ortiz',
            'email' => 'miguelortiz@gmail.com',
            'password' => Hash::make('password12345'), // Contraseña predeterminada
        ]);

        User::create([
            'name' => 'Noel',
            'lastname' => 'Vermellion',
            'email' => 'noelvermellion@gmail.com',
            'password' => Hash::make('password12345'), // Contraseña predeterminada
        ]);
    }
}
