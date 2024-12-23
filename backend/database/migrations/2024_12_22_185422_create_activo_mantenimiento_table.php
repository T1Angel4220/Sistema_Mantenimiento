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
        Schema::create('activo_mantenimiento', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mantenimiento_id');
            $table->unsignedBigInteger('activo_id');
            $table->timestamps();

            $table->foreign('mantenimiento_id')->references('id')->on('mantenimiento')->onDelete('cascade');
            $table->foreign('activo_id')->references('id')->on('activos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activo_mantenimiento');
    }
};
