<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mantenimiento;

class Actividad extends Model
{
    use HasFactory;
    protected $table = 'actividades';
    protected $fillable = [
        'nombre',
    ];
    public function mantenimiento()
{
    return $this->belongsToMany(Mantenimiento::class, 'mantenimiento_id');
}

public function equipo()
{
    return $this->belongsToMany(Equipo::class);
}

}
