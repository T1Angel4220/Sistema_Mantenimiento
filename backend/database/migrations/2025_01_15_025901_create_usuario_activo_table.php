<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsuarioActivoTable extends Migration
{
    public function up(): void
    {
        Schema::create('usuario_activo', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('lastname');
            $table->string('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario_activo');
    }
}
