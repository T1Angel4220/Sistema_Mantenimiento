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
        Schema::create('mantenimiento_actividad', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('mantenimiento_id'); // Define la columna
            $table->unsignedBigInteger('actividad_id');
            $table->unsignedBigInteger('equipo_id'); 
            // Define la columna
            $table->foreign('mantenimiento_id')->references('id')->on('mantenimiento')->onDelete('cascade'); // Foreign key for 'mantenimiento' table
            $table->foreign('actividad_id')->references('id')->on('actividades')->onDelete('cascade'); // Foreign key for 'actividades' table
            $table->foreign('equipo_id')->references('id')->on('equipos')->onDelete('cascade'); 
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenimiento_actividad');
    }
};
