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
        Schema::create('equipo_componentes', function (Blueprint $table) {
            $table->id(); // ID autoincremental
            $table->unsignedBigInteger('equipo_mantenimiento_id'); // Relación con equipo_mantenimiento
            $table->unsignedBigInteger('componente_id'); // Relación con componentes
            $table->integer('cantidad')->default(1); // Cantidad de componentes
            $table->timestamps(); // Fechas de creación y actualización

            // Claves foráneas
            $table->foreign('equipo_mantenimiento_id')->references('id')->on('equipo_mantenimiento')->onDelete('cascade');
            $table->foreign('componente_id')->references('id')->on('componentes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipo_componentes');
    }
};
