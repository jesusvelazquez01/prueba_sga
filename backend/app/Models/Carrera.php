<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Carrera extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
        'contenido',
        'imagen_url',
        'plan_estudio_url',
        'resolucion_url',
        'duracion',
        'modalidad',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function postulantes()
    {
        return $this->belongsToMany(Postulante::class, 'carrera_postulante');
    }
}
