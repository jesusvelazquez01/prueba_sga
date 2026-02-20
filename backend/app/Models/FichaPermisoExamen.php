<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FichaPermisoExamen extends Model
{
    protected $fillable = [
        'carrera_id',
        'apellido',
        'nombres',
        'dni',
        'telefono',
        'fecha',
        'materias',
        'status',
        'preference_id',
        'payment_id',
        'monto',
    ];

    protected $casts = [
        'materias' => 'array',
        'fecha' => 'date',
    ];

    public function carrera()
    {
        return $this->belongsTo(Carrera::class);
    }
}
