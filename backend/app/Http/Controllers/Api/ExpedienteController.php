<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expediente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExpedienteController extends Controller
{
    public function show($codigo)
    {
        // 1. Buscamos el expediente por su código y traemos su historial de movimientos
        // Ordenamos los movimientos del más reciente al más antiguo
        $expediente = Expediente::with(['movimientos' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->where('codigo', $codigo)->first();

        // Si no existe, devolvemos error 404
        if (!$expediente) {
            return response()->json(['error' => 'Expediente no encontrado'], 404);
        }

        // 2. Preparamos la URL del PDF (si existe)
        $archivoUrl = null;
        if ($expediente->archivo_digital) {
            // Usamos Storage::url para que genere el enlace correcto (ej: /storage/expedientes_digitales/doc.pdf)
            $archivoUrl = url(Storage::url($expediente->archivo_digital));
        }

        // 3. Formateamos el Historial exactamente como lo pide React
        $historialFormateado = $expediente->movimientos->map(function ($mov) use ($expediente) {
            return [
                'fojas' => $expediente->cantidad_fojas, // Usamos la cantidad actual del expediente
                'fecha' => $mov->created_at->format('d/m/Y'),
                'hora' => $mov->created_at->format('H:i'),
                // Verificamos si es Enum para sacar el texto correcto, si no, mostramos el valor
                'origen' => $mov->area_origen instanceof \UnitEnum ? $mov->area_origen->name : ($mov->area_origen ?? 'N/A'),
                'destino' => $mov->area_destino instanceof \UnitEnum ? $mov->area_destino->name : ($mov->area_destino ?? 'N/A'),
                'enviado_por' => $mov->enviado_por ?? 'No registrado',
                'recibido_por' => $mov->recibido_por ?? 'No registrado',
                'observaciones' => $mov->observaciones,
            ];
        });

        // 4. Armamos la Respuesta JSON final
        return response()->json([
            'codigo' => $expediente->codigo,
            'asunto' => $expediente->asunto,
            'iniciado_por' => $expediente->iniciado_por,
            'cantidad_fojas' => $expediente->cantidad_fojas,
            'fecha_inicio' => $expediente->created_at->format('d/m/Y'),
            'estado' => $expediente->estado,
            'archivo_digital_url' => $archivoUrl, // <-- Aquí enviamos la URL del PDF
            'historial' => $historialFormateado,  // <-- Y aquí el historial detallado
        ]);
    }
}
