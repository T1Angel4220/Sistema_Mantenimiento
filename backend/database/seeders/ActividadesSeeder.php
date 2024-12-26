<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Actividad; // Asegúrate de que el modelo Actividad esté creado

class ActividadesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Actividades predefinidas
        $actividades = [
            ['nombre' => 'Revisión general'],
            ['nombre' => 'Limpieza interna'],
            ['nombre' => 'Actualización de software'],
            ['nombre' => 'Cambio de piezas'],
            ['nombre' => 'Calibración de equipo'],
            ['nombre' => 'Revisión de conexiones eléctricas'],
            ['nombre' => 'Reemplazo de batería'],
            ['nombre' => 'Diagnóstico de fallas'],
            ['nombre' => 'Revisión de ventilación'],
            ['nombre' => 'Reconfiguración de sistema operativo'],
            ['nombre' => 'Pruebas de rendimiento'],
            ['nombre' => 'Inspección de cableado'],
            ['nombre' => 'Mantenimiento preventivo'],
            ['nombre' => 'Reparación de hardware'],
            ['nombre' => 'Ajuste de configuraciones'],
            ['nombre' => 'Verificación de licencias'],
            ['nombre' => 'Revisión de sensores'],
            ['nombre' => 'Pruebas de compatibilidad'],
            ['nombre' => 'Actualización de firmware'],
            ['nombre' => 'Revisión de dispositivos periféricos'],
        ];

        // Insertar actividades si no existen
        foreach ($actividades as $actividad) {
            Actividad::firstOrCreate(
                ['nombre' => $actividad['nombre']], // Condición para verificar existencia
                ['created_at' => now(), 'updated_at' => now()] // Campos a insertar si no existe
            );
        }
    }
}
