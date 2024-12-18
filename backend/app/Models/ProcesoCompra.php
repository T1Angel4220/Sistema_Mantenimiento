<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcesoCompra extends Model
{
    use HasFactory;

    protected $table = 'procesos_compra'; // Nombre de tu tabla
    protected $fillable = ['nombre', 'descripcion', 'fecha', 'proveedor'];
}
