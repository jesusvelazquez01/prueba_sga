<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Postulante;
class PostulantesDatosrview extends BaseWidget
{
    protected static ?string $maxHeight = '300px';

    public function getColumnSpan(): int|string|array
    {
        return 'full';
    }

    protected function getStats(): array
    
    {
        return [
            

              Stat::make('Total Postulantes', Postulante::count())
                ->description('Postulantes registrados')
                ->descriptionIcon('heroicon-m-arrow-trending-up'),
            
            Stat::make('Postulantes Contactados', Postulante::where('contactado', true)->count())
                ->description('Ya contactados')
                ->descriptionIcon('heroicon-m-check-circle'),
            
            Stat::make('Postulantes sin Contactar', Postulante::where('contactado', false)->count())
                ->description('Pendientes de contacto')
                ->descriptionIcon('heroicon-m-exclamation-circle'),
        ];
    }
}
