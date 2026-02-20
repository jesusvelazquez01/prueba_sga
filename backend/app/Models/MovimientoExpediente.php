<?php

namespace App\Models;

use App\Enums\Area;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoExpediente extends Model
{
    use HasFactory;

    protected $fillable = [
        'expediente_id',
        'user_id',
        'area_origen',
        'area_destino',
        'observaciones',
        'fecha_pase',
        'fecha_recepcion',
        
        // --- AGREGAMOS ESTOS DOS PARA QUE FUNCIONE EL GUARDADO MANUAL ---
        'enviado_por',  // Persona física que entrega
        'recibido_por', // Persona física que recibe
    ];

    protected $casts = [
        'area_origen' => Area::class,
        'area_destino' => Area::class,
        'fecha_pase' => 'datetime',
        'fecha_recepcion' => 'datetime',
    ];

    public function expediente(): BelongsTo
    {
        return $this->belongsTo(Expediente::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}