<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mantenimiento;
use App\Models\Componente;
use App\Models\ProcesoCompra;

class Equipo extends Model
{
    use HasFactory;

    protected $fillable = [
        'Nombre_Producto',
        'Codigo_Barras',
        'Tipo_Equipo',
        'Fecha_Adquisicion',
        'Ubicacion_Equipo',
        'Descripcion_Equipo',
        'proceso_compra_id'
    ];

    public function procesoCompra()
    {
        return $this->belongsTo(ProcesoCompra::class, 'proceso_compra_id', 'id');
    }

    /**
     * Relación muchos a muchos con mantenimientos.
     */
    public function mantenimientos()
    {
        return $this->belongsToMany(Mantenimiento::class, 'equipo_mantenimiento', 'mantenimiento_id', 'equipo_id')
            ->withTimestamps();
    }

    /**
     * Relación muchos a muchos con componentes.
     */
    public function componentes()
    {
        return $this->belongsToMany(Componente::class, 'equipo_componentes', 'componente_id', 'equipo_mantenimiento_id');
    }

    /**
     * Relación uno a muchos (inversa) con procesos de compra.
     */

}
