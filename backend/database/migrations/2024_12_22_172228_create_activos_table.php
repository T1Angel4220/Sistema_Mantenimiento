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
        Schema::create('activos', function (Blueprint $table) {
            $table->id(); // id SERIAL PRIMARY KEY
            $table->string('codigo_barras', 100)->unique(); // codigo_barras VARCHAR(100) UNIQUE NOT NULL
            $table->string('nombre', 255); // nombre VARCHAR(255) NOT NULL
            $table->enum('tipo_activo', ['Informático', 'Electrónicos y Eléctricos', 'Industriales']); // tipo_activo ENUM
            $table->date('fecha_adquisicion')->nullable(); // fecha_adquisicion DATE
            $table->enum('ubicacion', ['Sala de Reuniones', 'Departamento de TI', 'Laboratorio de Redes', 'Laboratorio CTT']); // ubicacion ENUM
            $table->text('descripcion')->nullable(); // descripcion TEXT
            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activos');
    }
};
