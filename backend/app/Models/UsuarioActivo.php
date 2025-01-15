<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioActivo extends Model
{
    use HasFactory;

    // Definir la tabla correspondiente en la base de datos
    protected $table = 'usuario_activo';

    // Las columnas que se pueden asignar masivamente
    protected $fillable = [
        'name', 'lastname', 'email', 'email_verified_at',
        'password', 'remember_token', 'created_at', 'updated_at'
    ];

    // Si la tabla tiene timestamps (created_at y updated_at), asegurate de que esta propiedad esté activada
    public $timestamps = true;
}
