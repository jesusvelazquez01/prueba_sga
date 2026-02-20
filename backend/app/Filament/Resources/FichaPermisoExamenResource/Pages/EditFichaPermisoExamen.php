<?php

namespace App\Filament\Resources\FichaPermisoExamenResource\Pages;

use App\Filament\Resources\FichaPermisoExamenResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditFichaPermisoExamen extends EditRecord
{
    protected static string $resource = FichaPermisoExamenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
