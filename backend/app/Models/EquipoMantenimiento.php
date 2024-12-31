<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipoMantenimiento extends Model
{
    use HasFactory;

    protected $table = 'equipo_mantenimiento';
    
    protected $fillable = [
        'mantenimiento_id',
        'equipo_id'
    ];

    public function mantenimiento()
    {
        return $this->belongsTo(Mantenimiento::class);
    }

    public function equipo()
    {
        return $this->belongsTo(Equipo::class);
    }

    public function componentes()
    {
        return $this->belongsToMany(Componente::class, 'equipo_componentes')
            ->withPivot('cantidad');
    }
}
