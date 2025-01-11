<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Observacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'mantenimiento_id',
        'equipo_id',
        'observacion',
    ];

    public function mantenimiento()
{
    return $this->belongsTo(Mantenimiento::class, 'mantenimiento_id');
}

public function equipo()
{
    return $this->belongsTo(Equipo::class);
}

}
