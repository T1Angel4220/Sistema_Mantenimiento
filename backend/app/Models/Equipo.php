<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Mantenimiento;
use App\Models\Componente;
use App\Models\ProcesoCompra;
use App\Models\Observacion;

class Equipo extends Model
{
    use HasFactory;

    protected $fillable = [
        'Nombre_Producto',
        'Codigo_Barras',
        'Tipo_Equipo',
        'Fecha_Adquisicion',
        'Ubicacion_Equipo',
        'Descripcion_Equipo',
        'proceso_compra_id'
    ];

    public function procesoCompra()
    {
        return $this->belongsTo(ProcesoCompra::class, 'proceso_compra_id', 'id');
    }

    /**
     * Relación muchos a muchos con mantenimientos.
     */
    public function mantenimientos()
    {
        return $this->belongsToMany(Mantenimiento::class, 'equipo_mantenimiento', 'equipo_id', 'mantenimiento_id');
    }
    
    public function actividades()
    {
        return $this->hasMany(Actividad::class);
    }
    
    public function observaciones()
    {
        return $this->hasMany(Observacion::class);
    }
    

}
