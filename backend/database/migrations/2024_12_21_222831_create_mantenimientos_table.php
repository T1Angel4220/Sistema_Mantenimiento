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
        Schema::create('mantenimientos', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->string('responsable', 100);
            $table->string('tipo', 50);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });

        // Add the CHECK constraint for the 'tipo' column
        DB::statement("ALTER TABLE mantenimientos ADD CONSTRAINT tipo_check CHECK (tipo IN ('interno', 'externo'))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the CHECK constraint before dropping the table
        DB::statement("ALTER TABLE mantenimientos DROP CONSTRAINT tipo_check");

        Schema::dropIfExists('mantenimientos');
    }
};
