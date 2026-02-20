<?php

namespace App\Models;

use App\Enums\Area;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Expediente extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'asunto',
        'descripcion',   // <--- AGREGADO: Para que guarde la descripción
        'iniciado_por',
        'dni_iniciador',
        'telefono',      // <--- AGREGADO: Para que guarde el WhatsApp
        'cantidad_fojas',
        'area_actual',
        'estado',
        'archivo_digital',
        'qr_code',
        'barcode',
    ];

    protected $casts = [
        'area_actual' => Area::class, // Convierte el texto en Enum automáticamente
    ];

    /**
     * Generación automática del Código de Expediente
     * Se ejecuta justo antes de guardar en la BD.
     */
    protected static function booted()
    {
        static::creating(function ($expediente) {
            // 1. Obtener el último ID (si es el primero, será 0)
            $ultimoId = static::max('id') ?? 0;
            $nextId = $ultimoId + 1;

            // 2. Año actual (Ej: 26)
            $anio = date('y');
            
            // 3. Obtener el nombre del Área de forma segura
            $area = $expediente->area_actual instanceof \UnitEnum 
                ? $expediente->area_actual->name 
                : ($expediente->area_actual ?? 'REC');
            
            // 4. Formato final: 0001_REC_26
            $expediente->codigo = str_pad($nextId, 4, '0', STR_PAD_LEFT) . '_' . $area . '_' . $anio;
        });
    }

    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoExpediente::class);
    }
}