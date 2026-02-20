<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Postulante;
use Illuminate\Support\Facades\DB;

class PostulantesporCarreraChart extends ChartWidget
{
    protected static ?string $heading = 'Postulantes por Carrera';
    protected static ?string $maxHeight = '300px';

    public function getColumnSpan(): int|string|array
    {
        return 'md:6';
    }

    protected function getData(): array
    {
        $postulantesCarrera = DB::table('carrera_postulante')
            ->join('carreras', 'carrera_postulante.carrera_id', '=', 'carreras.id')
            ->select('carreras.nombre', DB::raw('count(*) as total'))
            ->groupBy('carreras.nombre')
            ->pluck('total', 'nombre')
            ->toArray();
        
        $labels = array_keys($postulantesCarrera);
        $data = array_values($postulantesCarrera);
        
        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Postulantes por Carrera',
                    'data' => $data,
                    'backgroundColor' => [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                    ],
                ],
            ],
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
}
