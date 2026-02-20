<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carrera;

class CarreraController extends Controller
{
    public function index()
    {
        $carreras = Carrera::where('activa', true)->get();

        return response()->json($carreras->map(function ($carrera) {
            return [
                'id' => $carrera->id,
                'title' => $carrera->nombre,
                'slug' => $carrera->slug,
                'description' => $carrera->descripcion,
                'image' => $carrera->imagen_url ? asset('storage/' . $carrera->imagen_url) : null,
            ];
        }));
    }

    public function show($slug)
    {
        $carrera = Carrera::where('slug', $slug)->where('activa', true)->firstOrFail();

        return response()->json([
            'id' => $carrera->id,
            'title' => $carrera->nombre,
            'description' => $carrera->descripcion,
            'content' => $carrera->contenido,
            'duration' => $carrera->duracion,
            'modality' => $carrera->modalidad,
            'image' => $carrera->imagen_url ? asset('storage/' . $carrera->imagen_url) : null,
            'plan_estudio' => $carrera->plan_estudio_url ? asset('storage/' . $carrera->plan_estudio_url) : null,
            'resolucion' => $carrera->resolucion_url ? asset('storage/' . $carrera->resolucion_url) : null,
        ]);
    }
}
