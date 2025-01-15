<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mantenimiento', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_mantenimiento', 20)->unique();
            $table->enum('tipo', ['Interno', 'Externo']);
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin');
            $table->string('nombre_responsable'); // Columna para el nombre del responsable
            $table->string('apellido_responsable')->nullable();;
            $table->enum('proveedor', ['ACME Maintenance', 'TechSupport S.A.', 'ServiMaq Ltda.', 'Otro'])->nullable();
            $table->string('contacto_proveedor', 255)->nullable();
            $table->decimal('costo', 10, 2)->nullable();
            $table->timestamps(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar la tabla 'mantenimiento' con CASCADE
        DB::statement('DROP TABLE IF EXISTS mantenimiento CASCADE');
    }
};
