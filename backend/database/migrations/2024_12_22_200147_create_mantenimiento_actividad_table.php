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
            $table->id(); // 'id' column as primary key
            $table->foreignId('mantenimiento_id')->constrained('mantenimiento')->onDelete('cascade'); // Foreign key for 'mantenimiento' table
            $table->foreignId('actividad_id')->constrained('actividades')->onDelete('cascade'); // Foreign key for 'actividades' table
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
