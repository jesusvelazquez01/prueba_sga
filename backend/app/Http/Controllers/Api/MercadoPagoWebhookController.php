<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FichaPermisoExamen;
use Illuminate\Http\Request;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;

class MercadoPagoWebhookController extends Controller
{
    public function handle(Request $request)
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.token'));

        $type = $request->input('type') ?? $request->input('topic');

        if ($type === 'payment') {
            $id = $request->input('data.id') ?? $request->input('id');

            try {
                $client = new PaymentClient();
                $payment = $client->get($id);

                $fichaId = $payment->external_reference;
                $ficha = FichaPermisoExamen::find($fichaId);

                if ($ficha) {

                    $ficha->update([
                        'status' => $payment->status,
                        'payment_id' => $payment->id
                    ]);

                    \Log::info("Pago procesado para Ficha ID: $fichaId - Estado: $payment->status");
                }
            } catch (\Exception $e) {
                \Log::error("Error procesando Webhook MP: " . $e->getMessage());
            }
        }

        return response()->json(['status' => 'ok'], 200);
    }
}
