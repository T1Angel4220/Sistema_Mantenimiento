<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MantenimientoActividad extends Model
{
    protected $table = 'mantenimiento_actividad';

    // Define the fillable attributes
    protected $fillable = [
        'mantenimiento_id',
        'actividad_id',
    ];

    // Define relationships
    public function mantenimiento()
    {
        return $this->belongsTo(Mantenimiento::class);
    }

    public function actividad()
    {
        return $this->belongsTo(Actividad::class);
    }
}
