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
        Schema::table('mantenimiento', function (Blueprint $table) {
            // Agregar el campo 'estado' con valores limitados
            $table->enum('estado', ['Terminado', 'No terminado'])->default('No terminado')->after('observaciones');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mantenimiento', function (Blueprint $table) {
            // Eliminar el campo 'estado'
            $table->dropColumn('estado');
        });
    }
};

