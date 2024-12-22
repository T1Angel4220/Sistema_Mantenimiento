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
            $table->id(); // ID autoincremental
            $table->string('nombre', 150); // Nombre del proceso de compra
            $table->text('descripcion')->nullable(); // Descripción opcional
            $table->date('fecha'); // Fecha
            $table->enum('proveedor', ['Amazon', 'eBay', 'Alibaba', 'MercadoLibre', 'Shopify']);
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
