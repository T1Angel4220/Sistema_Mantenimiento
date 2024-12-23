<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Activo;
use App\Models\Actividad;

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
        'observaciones',
    ];

    public function activos()
    {
        return $this->belongsToMany(Activo::class, 'activo_mantenimiento', 'mantenimiento_id', 'activo_id')
            ->withTimestamps();
    }
    public function actividades()
    {
        return $this->belongsToMany(Actividad::class, 'mantenimiento_actividad', 'mantenimiento_id', 'actividad_id')
            ->withTimestamps();
    }
}
