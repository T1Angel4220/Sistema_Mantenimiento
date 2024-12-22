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
        Schema::create('mantenimiento', function (Blueprint $table) {
            $table->id(); // Crea la columna id SERIAL
            $table->string('codigo_mantenimiento', 20)->unique(); // Columna codigo_mantenimiento
            $table->enum('tipo', ['Interno', 'Externo']); // Columna tipo ENUM
            $table->date('fecha_inicio')->nullable(); // Columna fecha_inicio
            $table->date('fecha_fin'); // Columna fecha_fin
            $table->enum('proveedor', ['ACME Maintenance', 'TechSupport S.A.', 'ServiMaq Ltda.', 'Otro'])->nullable(); // Columna proveedor ENUM
            $table->string('contacto_proveedor', 255)->nullable(); // Columna contacto_proveedor
            $table->decimal('costo', 10, 2)->nullable(); // Columna costo NUMERIC(10, 2)
            $table->text('observaciones')->nullable(); // Columna observaciones TEXT
            $table->timestamps(0); // Crea las columnas created_at y updated_at
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mantenimiento');
    }
};
