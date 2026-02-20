<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostulanteResource\Pages;
use App\Models\Postulante;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PostulanteResource extends Resource
{
    protected static ?string $model = Postulante::class;

    // Icono de personas/grupo
    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Bandeja de Postulantes';
    protected static ?string $modelLabel = 'Postulante';
    protected static ?string $navigationGroup = 'Gestión de Alumnos';

    // Badge en el menú lateral para mostrar cuántos "Nuevos" hay sin contactar
    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('contactado', false)->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return static::getModel()::where('contactado', false)->count() > 0 ? 'danger' : 'success';
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Información del Contacto')
                    ->description('Datos personales y de ubicación del alumno.')
                    ->schema([
                        Forms\Components\TextInput::make('nombre_completo')
                            ->label('Nombre Completo')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->prefixIcon('heroicon-m-envelope')
                            ->maxLength(255),

                        Forms\Components\TextInput::make('telefono')
                            ->tel()
                            ->prefixIcon('heroicon-m-phone')
                            ->maxLength(255),

                        // --- AQUÍ ESTÁ EL SELECT ARREGLADO ---
                        Forms\Components\Select::make('localidad')
                            ->label('Localidad')
                            ->searchable() // Permite escribir para buscar
                            ->native(false) // Usa el estilo bonito de Filament
                            ->options([
                                'San Salvador de Jujuy' => 'San Salvador de Jujuy',
                                'Palpalá' => 'Palpalá',
                                'San Pedro' => 'San pedro',
                                'Libertador Gral. San Martín' => 'Libertador Gral. San Martín',
                                'Perico' => 'Perico',
                                'Humahuaca' => 'Humahuaca',
                                'Tilcara' => 'Tilcara',
                                'Maimará' => 'Maimará',
                                'Susques' => 'Susques',
                                'Abra Pampa' => 'Abra Pampa',
                                'La Quiaca' => 'La Quiaca',
                                'Otro' => 'Otro',
                            ]),
                        
                        Forms\Components\Toggle::make('contactado')
                            ->label('¿Ya fue contactado?')
                            ->onColor('success')
                            ->offColor('danger')
                            ->inline(false)
                            ->columnSpan(1), // Ocupa 1 columna
                    ])
                    ->columns(2), // 2 Columnas para que se vea ordenado

                Forms\Components\Section::make('Intereses y Mensaje')
                    ->schema([
                        Forms\Components\Select::make('carreras')
                            ->label('Carreras de Interés')
                            ->relationship('carreras', 'nombre')
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->columnSpanFull(), // Que ocupe todo el ancho para ver bien las etiquetas

                        Forms\Components\Textarea::make('mensaje')
                            ->label('Mensaje del Postulante')
                            ->columnSpanFull()
                            ->rows(3),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha Solicitud')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->description(fn(Postulante $record) => $record->created_at->diffForHumans()),

                Tables\Columns\TextColumn::make('nombre_completo')
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('localidad') // Agregué esto para ver de dónde son en la tabla
                    ->toggleable(isToggledHiddenByDefault: true),

                // Muestra las carreras en etiquetas de colores
                Tables\Columns\TextColumn::make('carreras.nombre')
                    ->label('Carrera de Interés')
                    ->badge()
                    ->color('info')
                    ->separator(','),

                Tables\Columns\TextColumn::make('telefono')
                    ->searchable()
                    ->icon('heroicon-m-phone'),

                // Toggle para marcar como contactado rápido desde la lista
                Tables\Columns\ToggleColumn::make('contactado')
                    ->label('Estado')
                    ->onColor('success')
                    ->offColor('danger')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\Filter::make('pendientes')
                    ->query(fn(Builder $query): Builder => $query->where('contactado', false))
                    ->label('Solo Pendientes')
                    ->default(),
            ])
            ->actions([
                // --- ACCIÓN PERSONALIZADA DE WHATSAPP ---
                Tables\Actions\Action::make('whatsapp')
                    ->label('Contactar')
                    ->icon('heroicon-o-chat-bubble-left-ellipsis')
                    ->color('success')
                    ->button()
                    ->url(function (Postulante $record) {
                        $numero = preg_replace('/[^0-9]/', '', $record->telefono);
                        $nombreCarrera = $record->carreras->first()?->nombre ?? 'nuestra oferta académica';
                        $mensaje = "Hola {$record->nombre_completo}, te escribimos del IESNH. Vimos tu consulta sobre *{$nombreCarrera}*. ¿En qué podemos ayudarte?";
                        $texto = urlencode($mensaje);
                        return "https://wa.me/{$numero}?text={$texto}";
                    })
                    ->openUrlInNewTab(),

                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('marcar_contactados')
                        ->label('Marcar como Contactados')
                        ->icon('heroicon-o-check')
                        ->action(fn($records) => $records->each->update(['contactado' => true]))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPostulantes::route('/'),
            'create' => Pages\CreatePostulante::route('/create'),
            'edit' => Pages\EditPostulante::route('/{record}/edit'),
        ];
    }
}