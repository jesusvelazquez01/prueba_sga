<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Postulante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostulanteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre_completo' => 'required|string',
            'email' => 'required|email',
            'telefono' => 'required|string',
            'localidad' => 'nullable|string',
            'mensaje' => 'nullable|string',
            'carrera_id' => 'nullable|exists:carreras,id',
        ]);

        try {
            DB::beginTransaction();

            $postulante = Postulante::firstOrCreate(
                ['email' => $request->email],
                [
                    'nombre_completo' => $request->nombre_completo,
                    'telefono' => $request->telefono,
                    'localidad' => $request->localidad,
                    'mensaje' => $request->mensaje
                ]
            );

            if ($request->carrera_id) {
                $postulante->carreras()->syncWithoutDetaching([$request->carrera_id]);
            }

            DB::commit();

            return response()->json(['message' => 'Solicitud enviada con éxito'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Error postulante: ' . $e->getMessage());
            return response()->json(['error' => 'Error al procesar la solicitud'], 500);
        }
    }
}
