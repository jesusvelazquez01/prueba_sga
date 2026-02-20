<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CarreraController;
use App\Http\Controllers\Api\PostulanteController;
use App\Http\Controllers\Api\FichaPermisoExamenController;
use App\Http\Controllers\Api\MercadoPagoWebhookController;
use App\Http\Controllers\Api\ExpedienteController;

// Rutas Públicas de Carreras ---
Route::get('/carreras', [CarreraController::class, 'index']);
Route::get('/carreras/{slug}', [CarreraController::class, 'show']);
Route::get('/expediente/{codigo}', [ExpedienteController::class, 'show']);
// Gestión de Postulantes ---
Route::post('/postulantes', [PostulanteController::class, 'store']);

// Flujo de Examen y Mercado Pago

// Webhook 
Route::post('/webhooks/mercadopago', [MercadoPagoWebhookController::class, 'handle']);

// Rutas específicas de descarga
Route::get('/fichas-permiso/{ficha}/comprobante', [FichaPermisoExamenController::class, 'descargarComprobante']);
Route::get('/fichas-permiso/{ficha}/pdf', [FichaPermisoExamenController::class, 'descargarPdf']);

// Resource de la API
Route::apiResource('fichas-permiso', FichaPermisoExamenController::class)->only(['store', 'show']);
