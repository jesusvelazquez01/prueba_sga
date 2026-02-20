<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Postulante;
use Illuminate\Support\Facades\DB;

class PostualantesPorLocalidadChart extends ChartWidget
{
 protected static ?string $heading = 'Postulantes por Localidad';
 protected static ?string $maxHeight = '300px';

    public function getColumnSpan(): int|string|array
    {
        return 'md:6';
    }

    protected function getData(): array
    {
        $postulantesLocalidad = Postulante::query()
            ->select('localidad', DB::raw('count(*) as total'))
            ->groupBy('localidad')
            ->pluck('total', 'localidad')
            ->toArray();
        
        $labels = array_keys($postulantesLocalidad);
        $data = array_values($postulantesLocalidad);
        
        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Postulantes por Localidad',
                    'data' => $data,
                    'backgroundColor' => [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#36A2EB',
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
