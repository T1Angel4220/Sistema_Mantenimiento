<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Componente; // Asegúrate de tener el modelo creado
use Illuminate\Support\Facades\DB;

class ComponentesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Componentes predefinidos
        $componentes = [
            ['nombre' => 'Disco duro', 'descripcion' => 'Almacena datos y programas del sistema.'],
            ['nombre' => 'Memoria RAM', 'descripcion' => 'Componente para almacenamiento temporal de datos.'],
            ['nombre' => 'Procesador', 'descripcion' => 'Unidad que procesa las instrucciones del sistema.'],
            ['nombre' => 'Tarjeta gráfica', 'descripcion' => 'Se encarga del procesamiento gráfico del equipo.'],
            ['nombre' => 'Fuente de poder', 'descripcion' => 'Provee energía eléctrica a los componentes del equipo.'],
            ['nombre' => 'Tarjeta madre', 'descripcion' => 'Placa base que conecta todos los componentes.'],
            ['nombre' => 'Ventilador de CPU', 'descripcion' => 'Disipa el calor generado por el procesador.'],
            ['nombre' => 'Teclado', 'descripcion' => 'Dispositivo de entrada para escritura y control.'],
            ['nombre' => 'Monitor', 'descripcion' => 'Pantalla para la visualización del sistema.'],
            ['nombre' => 'Batería CMOS', 'descripcion' => 'Mantiene la configuración del BIOS del sistema.'],
            ['nombre' => 'Unidad óptica', 'descripcion' => 'Lector de discos CD/DVD.'],
            ['nombre' => 'Tarjeta de red', 'descripcion' => 'Permite la conexión a redes locales e internet.'],
            ['nombre' => 'Disipador térmico', 'descripcion' => 'Absorbe y disipa el calor de los componentes.'],
            ['nombre' => 'SSD', 'descripcion' => 'Disco de estado sólido para almacenamiento rápido.'],
            ['nombre' => 'Cámara web', 'descripcion' => 'Dispositivo de captura de video para videoconferencias.'],
        ];

        // Insertar componentes si no existen
        foreach ($componentes as $componente) {
            Componente::firstOrCreate(
                ['nombre' => $componente['nombre']],
                ['descripcion' => $componente['descripcion'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
