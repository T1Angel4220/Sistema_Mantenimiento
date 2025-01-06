<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mantenimiento', function (Blueprint $table) {
            $table->dropColumn('estado'); // Elimina el campo actual
        });

        Schema::table('mantenimiento', function (Blueprint $table) {
            $table->enum('estado', ['Terminado', 'No terminado'])->default('No terminado');
        });
    }

    public function down(): void
    {
        Schema::table('mantenimiento', function (Blueprint $table) {
            $table->dropColumn('estado'); // Elimina el campo ENUM
            $table->string('estado', 255)->default('No terminado'); // Vuelve al campo VARCHAR
        });
    }
};

