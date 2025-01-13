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
        Schema::create('procesos_compra', function (Blueprint $table) {
            $table->string('id')->primary(); // Cambiado a string para permitir formato PRC-XXX
            $table->string('nombre', 150); // Nombre del proceso de compra
            $table->text('descripcion')->nullable(); // Descripción opcional
            $table->date('fecha'); // Fecha
            $table->string('proveedor');
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procesos_compra');
    }
};
