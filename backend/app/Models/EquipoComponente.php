<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipoComponente extends Model
{
    use HasFactory;

    /**
     * Tabla asociada al modelo.
     *
     * Laravel infiere el nombre de la tabla como el plural del nombre del modelo.
     * Si necesitas especificar un nombre de tabla diferente, usa la propiedad `$table`.
     */
    protected $table = 'equipo_componentes';

    /**
     * Columnas que pueden asignarse masivamente.
     */
    protected $fillable = [
        'mantenimiento_id',
        'equipo_mantenimiento_id',
        'componente_id',
        'cantidad',
    ];

    /**
     * Relación con el modelo EquipoMantenimiento.
     *
     * Un registro de equipo_componente pertenece a un equipo_mantenimiento.
     */
    public function equipoMantenimiento()
    {
        return $this->belongsTo(EquipoMantenimiento::class, 'equipo_mantenimiento_id');
    }

    /**
     * Relación con el modelo Componente.
     *
     * Un registro de equipo_componente pertenece a un componente.
     */
    
    public function equipo()
    {
        return $this->belongsTo(Equipo::class, 'equipo_mantenimiento_id');
    }

    // Relación con el modelo Componente
    public function componente()
    {
        return $this->belongsTo(Componente::class, 'componente_id');
    }
}
