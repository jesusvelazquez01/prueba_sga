<?php

namespace App\Filament\Resources\FichaPermisoExamenResource\Pages;

use App\Filament\Resources\FichaPermisoExamenResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\FichasPermisoExport;


class ListFichaPermisoExamens extends ListRecords
{
    protected static string $resource = FichaPermisoExamenResource::class;

    protected function getHeaderActions(): array
    {
        return [

            Actions\Action::make('exportarExcel')
                ->label('Exportar Excel (Filtrado)')
                ->icon('heroicon-o-document-text')
                ->color('success')
                ->action(function () {

                    $query = $this->getFilteredTableQuery();

                    return Excel::download(
                        new FichasPermisoExport($query),
                        'Listado_Permisos_Examen_' . now()->format('Ymd_His') . '.xlsx'
                    );
                }),

            Actions\CreateAction::make(),
        ];
    }
}
