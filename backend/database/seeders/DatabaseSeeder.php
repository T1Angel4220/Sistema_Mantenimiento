<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ActividadesSeeder::class,
            ComponentesSeeder::class, // Agrega aquí el seeder de componentes
            UserSeeder::class,
        ]);
    }
}
