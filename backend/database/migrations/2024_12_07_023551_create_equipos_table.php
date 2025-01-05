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
            $table->string('Codigo_Barras', 100)->unique();
            $table->enum('Tipo_Equipo', ['Informático', 'Electrónicos y Eléctricos', 'Industriales', 'Audiovisuales']); // Opciones predefinidas
            $table->date('Fecha_Adquisicion');
            $table->enum('Ubicacion_Equipo', ['Departamento de TI', 'Laboratorio de Redes', 'Sala de reuniones', 'Laboratorio CTT']);
            $table->string('Descripcion_Equipo');

            // Campo para la relación con procesos_compra
            $table->string('proceso_compra_id');
            $table->foreign('proceso_compra_id')->references('id')->on('procesos_compra')->onDelete('cascade');

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
