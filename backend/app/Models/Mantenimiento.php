<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Equipo;
use App\Models\Actividad;
use App\Models\Observacion;
class Mantenimiento extends Model
{
    use HasFactory;
    protected $table = 'mantenimiento';


    protected $fillable = [
        'codigo_mantenimiento',
        'tipo',
        'fecha_inicio',
        'fecha_fin',
        'proveedor',
        'contacto_proveedor',
        'costo',
        'estado',
    ];
    
    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'costo' => 'decimal:2',
    ];
    

    public function equipos()
    {
        return $this->belongsToMany(Equipo::class, 'equipo_mantenimiento', 'mantenimiento_id', 'equipo_id');
    }
    
    public function actividades()
    {
        return $this->belongsToMany(Actividad::class, 'mantenimiento_actividad');
    }
    

    
}
