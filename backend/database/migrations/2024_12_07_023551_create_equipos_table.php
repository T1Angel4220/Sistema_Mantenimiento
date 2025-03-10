<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipos', function (Blueprint $table) {
            $table->id();
            $table->string('Nombre_Producto');
            $table->enum('Tipo_Equipo', ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales']); // Opciones predefinidas
            $table->date('Fecha_Adquisicion'); 
            $table->enum('Ubicacion_Equipo', ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT']); 
            $table->string('Descripcion_Equipo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};
