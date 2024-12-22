<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Componente extends Model
{
    use HasFactory;

    protected $table = 'componentes'; // Explicitly specify the table name

    // Define the fillable attributes (for mass assignment protection)
    protected $fillable = [
        'nombre',
        'descripcion',
    ];
}
