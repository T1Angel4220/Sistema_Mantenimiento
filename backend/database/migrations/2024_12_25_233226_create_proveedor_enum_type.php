<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Crear el tipo ENUM 'proveedor'
        DB::statement("
            CREATE TYPE proveedor AS ENUM (
                'ACME Maintenance',
                'TechSupport S.A.',
                'ServiMaq Ltda.',
                'Otro'
            );
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar el tipo ENUM 'proveedor' en caso de rollback
        DB::statement("DROP TYPE IF EXISTS proveedor;");
    }
};
