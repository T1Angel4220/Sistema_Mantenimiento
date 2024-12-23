<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mantenimiento;

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
    public function mantenimientos()
    {
        return $this->belongsToMany(Mantenimiento::class, 'activo_mantenimiento', 'mantenimiento_id', 'activo_id')
            ->withTimestamps();
    }
    
}
