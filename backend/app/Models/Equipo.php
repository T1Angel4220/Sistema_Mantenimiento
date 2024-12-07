<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;
    protected $fillable = ['Nombre_Producto','Tipo_Equipo','Fecha_Adquisicion','Ubicacion_Equipo','Descripcion_Equipo'];
    
}
