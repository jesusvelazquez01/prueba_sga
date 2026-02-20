<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FichaPermisoExamen;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

class FichaPermisoExamenController extends Controller
{

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'carrera_id' => 'required|exists:carreras,id',
                'apellido' => 'required|string',
                'nombres' => 'required|string',
                'dni' => 'required|string',
                'telefono' => 'required|string',
                'fecha' => 'required|date',
                'materias' => 'nullable|array',
            ]);

            $data['status'] = 'pending';
            $data['monto'] = 20.00;

            $ficha = FichaPermisoExamen::create($data);

            // CONFIGURAR MERCADO PAGO
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.token'));
            $client = new PreferenceClient();

            $preference = $client->create([
                "items" => [[
                    "title" => "Derecho de Examen: " . $ficha->apellido,
                    "quantity" => 1,
                    "unit_price" => (float) $data['monto']
                ]],
                "back_urls" => [
                    "success" => "https://iesnuevohorizonte.com/PermisoExamen?step=3&ficha_id=" . $ficha->id,
                    "failure" => "https://iesnuevohorizonte.com/PermisoExamen?step=2&error=true",
                ],
                "notification_url" => "https://admin.iesnuevohorizonte.com/api/webhooks/mercadopago",
                "auto_return" => "approved",
                "external_reference" => (string) $ficha->id,
            ]);

            $ficha->update(['preference_id' => $preference->id]);

            return response()->json([
                'ficha_id' => $ficha->id,
                'init_point' => $preference->init_point
            ]);
        } catch (\Exception $e) {
            \Log::error("Error en Paso 1: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function descargarPdf(FichaPermisoExamen $ficha)
    {
        if (strtolower($ficha->status) !== 'approved') {
            return response()->json(['message' => 'El pago aún no ha sido confirmado.'], 403);
        }

        $ficha->load('carrera');

        $pdf = Pdf::loadView('pdf.ficha-permiso', compact('ficha'))
            ->setPaper('a4', 'landscape');

        $filename = "FichaPermiso_{$ficha->apellido}.pdf";

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Access-Control-Expose-Headers' => 'Content-Disposition'
        ]);
    }

    public function descargarComprobante(FichaPermisoExamen $ficha)
    {
        // Verificamos que esta pagado
        if ($ficha->status !== 'approved') {
            return response()->json(['message' => 'Comprobante no disponible.'], 403);
        }

        $pdf = Pdf::loadView('pdf.comprobante-pago', compact('ficha'))
            ->setPaper('a5', 'portrait');

        return $pdf->download('Comprobante_Pago_' . $ficha->id . '.pdf');
    }
}
