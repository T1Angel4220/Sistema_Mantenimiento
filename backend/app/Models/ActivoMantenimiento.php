<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivoMantenimiento extends Model
{
    use HasFactory;
    protected $table = 'activo_mantenimiento';

    protected $fillable = [
        'mantenimiento_id',
        'activo_id',
    ];
}
