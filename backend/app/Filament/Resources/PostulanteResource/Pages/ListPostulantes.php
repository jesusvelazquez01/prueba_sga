<?php

namespace App\Filament\Resources\PostulanteResource\Pages;

use App\Filament\Resources\PostulanteResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPostulantes extends ListRecords
{
    protected static string $resource = PostulanteResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
