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
        Schema::create('observaciones_mantenimiento', function (Blueprint $table) {
            $table->id(); // ID único para cada observación
            $table->unsignedBigInteger('mantenimiento_id'); // Relación con mantenimientos
            $table->unsignedBigInteger('equipo_id'); // Relación con equipos
            $table->text('observacion'); // Texto de la observación
            $table->timestamps(); // Tiempos de creación y actualización
        
            // Llaves foráneas
            $table->foreign('mantenimiento_id')->references('id')->on('mantenimiento')->onDelete('cascade');
            $table->foreign('equipo_id')->references('id')->on('equipos')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenimiento_observaciones');
    }
};
