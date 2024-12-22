<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activo extends Model
{
    use HasFactory;
    protected $table = 'activos';
    protected $fillable = [
        'codigo_barras',
        'nombre',
        'tipo_activo',
        'fecha_adquisicion',
        'ubicacion',
        'descripcion',
    ];
}
