<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mantenimiento;

class Equipo extends Model
{
    use HasFactory;
    protected $fillable = ['Nombre_Producto','Codigo_Barras','Tipo_Equipo','Fecha_Adquisicion','Ubicacion_Equipo','Descripcion_Equipo'];
    public function mantenimientos(){
        return $this->belongsToMany(Mantenimiento::class, 'equipo_mantenimiento', 'mantenimiento_id', 'equipo_id')
            ->withTimestamps();
    }
}
