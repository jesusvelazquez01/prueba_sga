<?php

namespace App\Filament\Resources\ExpedienteResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class MovimientosRelationManager extends RelationManager
{
    protected static string $relationship = 'movimientos';

    protected static ?string $title = 'Historial de Pases (Hoja de Ruta)';
    protected static ?string $icon = 'heroicon-m-clipboard-document-list';

    public function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->columns([
                Tables\Columns\TextColumn::make('fecha_pase')
                    ->label('Fecha y Hora')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('area_origen')
                    ->label('Origen')
                    ->badge()
                    ->color('gray'),

                Tables\Columns\IconColumn::make('flecha')
                    ->label('')
                    ->icon('heroicon-m-arrow-right')
                    ->default(true),

                Tables\Columns\TextColumn::make('area_destino')
                    ->label('Destino')
                    ->badge()
                    ->color('success'),

                Tables\Columns\TextColumn::make('enviado_por')
                    ->label('Entregado por')
                    ->searchable(),

                Tables\Columns\TextColumn::make('recibido_por')
                    ->label('Recibido por')
                    ->searchable(),

                Tables\Columns\TextColumn::make('observaciones')
                    ->label('Observaciones')
                    ->limit(40),
            ])
            ->filters([])
            ->headerActions([])
            ->actions([])
            ->bulkActions([])
            ->defaultSort('fecha_pase', 'desc');
    }
}