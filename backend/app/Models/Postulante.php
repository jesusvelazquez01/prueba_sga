<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulante extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_completo',
        'email',
        'telefono',
        'localidad',
        'mensaje',
        'contactado'
    ];

    protected $casts = [
        'contactado' => 'boolean',
    ];

    public function carreras()
    {
        return $this->belongsToMany(Carrera::class, 'carrera_postulante');
    }
}
