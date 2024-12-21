<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
    use HasFactory;

    // Si la tabla no sigue la convención de nombres, especifica el nombre de la tabla.
    protected $table = 'mantenimientos';

    // Especifica los campos que pueden ser asignados en masa (mass assignment)
    protected $fillable = [
        'fecha_inicio',
        'fecha_fin',
        'responsable',
        'tipo',
        'observaciones',
    ];
}

