<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcesoCompra extends Model
{
    use HasFactory;

    protected $table = 'procesos_compra';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'id',
        'nombre', 
        'descripcion', 
        'fecha', 
        'proveedor'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Obtener el último registro
            $lastRecord = static::orderBy('created_at', 'desc')->first();
            
            if (!$lastRecord) {
                // Si no hay registros previos, comenzar con PRC-001
                $model->id = 'PRC-001';
            } else {
                // Si el ID anterior ya tiene el formato PRC-XXX
                if (strpos($lastRecord->id, 'PRC-') === 0) {
                    $lastNumber = intval(substr($lastRecord->id, 4));
                    $model->id = 'PRC-' . str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
                } else {
                    // Si el ID anterior es numérico (para compatibilidad con registros existentes)
                    $model->id = 'PRC-' . str_pad($lastRecord->id + 1, 3, '0', STR_PAD_LEFT);
                }
            }
        });
    }
}

