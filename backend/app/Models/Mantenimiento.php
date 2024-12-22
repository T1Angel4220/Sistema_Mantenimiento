<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
