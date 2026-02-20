<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExpedienteResource\Pages;
use App\Filament\Resources\ExpedienteResource\RelationManagers;
use App\Models\Expediente;
use App\Models\MovimientoExpediente;
use App\Enums\Area;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Filament\Notifications\Notification;

class ExpedienteResource extends Resource
{
    protected static ?string $model = Expediente::class;

    protected static ?string $navigationIcon = 'heroicon-o-folder-open';
    protected static ?string $navigationGroup = 'Mesa de Entrada';
    protected static ?string $navigationLabel = 'Expedientes';
    protected static ?string $recordTitleAttribute = 'codigo';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        // --- TARJETA 1: DATOS Y DOCUMENTO ---
                        Forms\Components\Section::make('Datos del Expediente')
                            ->description('Información principal y documento digitalizado.')
                            ->icon('heroicon-o-document-text')
                            ->schema([
                                Forms\Components\TextInput::make('codigo')
                                    ->label('Código de Seguimiento')
                                    ->default('Se generará automáticamente')
                                    ->disabled()
                                    ->dehydrated(false)
                                    ->prefixIcon('heroicon-m-hashtag')
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('asunto')
                                    ->required()
                                    ->maxLength(255)
                                    ->placeholder('Ej: Inscripción a carrera, Equivalencias...')
                                    ->columnSpan(1),

                                Forms\Components\Textarea::make('descripcion')
                                    ->label('Descripción Adicional')
                                    ->placeholder('Detalles adicionales sobre el expediente...')
                                    ->rows(2)
                                    ->columnSpanFull(),

                                // --- ¡AQUÍ ESTÁ EL CAMPO RECUPERADO! ---
                                Forms\Components\FileUpload::make('archivo_digital')
                                    ->label('Documento Escaneado (PDF o Imagen)')
                                    ->directory('expedientes_digitales') // Se guardará en storage/app/public/expedientes_digitales
                                    ->acceptedFileTypes(['application/pdf', 'image/jpeg', 'image/png'])
                                    ->maxSize(5120) // Máximo 5MB
                                    ->downloadable()
                                    ->openable()
                                    ->columnSpanFull(),
                            ])->columns(2),

                        // --- TARJETA 2: CONTACTO ---
                        Forms\Components\Section::make('Iniciador & Contacto')
                            ->description('Datos de la persona que presenta la documentación.')
                            ->icon('heroicon-o-user-group')
                            ->schema([
                                Forms\Components\TextInput::make('iniciado_por')
                                    ->label('Nombre Completo')
                                    ->placeholder('Nombre y Apellido')
                                    ->prefixIcon('heroicon-m-user')
                                    ->required()
                                    ->columnSpan(2),

                                Forms\Components\TextInput::make('dni_iniciador')
                                    ->label('Documento (DNI)')
                                    ->numeric()
                                    ->placeholder('Sin puntos')
                                    ->prefixIcon('heroicon-m-identification')
                                    ->columnSpan(1),

                                Forms\Components\TextInput::make('telefono')
                                    ->label('Teléfono (WhatsApp)')
                                    ->tel()
                                    ->placeholder('Ej: 3885123456')
                                    ->helperText('Formato: Característica sin 0 y número sin 15.')
                                    ->prefixIcon('heroicon-m-phone')
                                    ->maxLength(15)
                                    ->columnSpan(1),
                            ])->columns(2),
                    ])->columnSpan(2),

                // --- COLUMNA LATERAL ---
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Estado y Ubicación')
                            ->description('Gestión actual del trámite')
                            ->icon('heroicon-o-map-pin')
                            ->schema([
                                Forms\Components\Select::make('area_actual')
                                    ->label('Área Física Actual')
                                    ->options(Area::class)
                                    ->default(Area::REC)
                                    ->prefixIcon('heroicon-m-building-office')
                                    ->required(),

                                Forms\Components\Select::make('estado')
                                    ->label('Estado del Trámite')
                                    ->options([
                                        'iniciado' => 'Iniciado',
                                        'en_tramite' => 'En Trámite',
                                        'resuelto' => 'Resuelto',
                                        'archivado' => 'Archivado',
                                    ])
                                    ->default('iniciado')
                                    ->prefixIcon('heroicon-m-arrow-path')
                                    ->required(),

                                Forms\Components\TextInput::make('cantidad_fojas')
                                    ->label('Cantidad de Fojas (Hojas)')
                                    ->numeric()
                                    ->default(1)
                                    ->prefixIcon('heroicon-m-document-duplicate')
                                    ->required(),
                            ]),
                    ])->columnSpan(1),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('codigo')
                    ->label('Código')
                    ->searchable()
                    ->weight('bold')
                    ->icon('heroicon-m-folder')
                    ->copyable(),
                
                Tables\Columns\TextColumn::make('asunto')
                    ->limit(30)
                    ->searchable(),

                Tables\Columns\TextColumn::make('iniciado_por')
                    ->label('Iniciador')
                    ->searchable()
                    ->icon('heroicon-m-user'),

                Tables\Columns\TextColumn::make('area_actual')
                    ->label('Ubicación')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('estado')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'iniciado' => 'gray',
                        'en_tramite' => 'warning',
                        'resuelto' => 'success',
                        'archivado' => 'danger',
                        default => 'gray',
                    }),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Fecha')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\Action::make('whatsapp')
                    ->label('WhatsApp')
                    ->icon('heroicon-o-chat-bubble-left-right')
                    ->color('success')
                    ->action(function (Expediente $record) {
                        if (empty($record->telefono)) {
                            Notification::make()
                                ->title('Falta Teléfono')
                                ->body('Este expediente no tiene un número de WhatsApp registrado.')
                                ->danger()
                                ->send();
                            return;
                        }
                        
                        $linkSeguimiento = url("/nhdocs?codigo={$record->codigo}"); 
                        $nombreArea = $record->area_actual instanceof Area 
                            ? $record->area_actual->getLabel() 
                            : ($record->area_actual ?? 'el área');

                        $mensaje = "Hola *{$record->iniciado_por}*. Su trámite *{$record->codigo}* ({$record->asunto}) se encuentra en *{$nombreArea}*.\n\n";
                        $mensaje .= "Puede seguirlo aquí: {$linkSeguimiento}";
                        
                        $url = "https://wa.me/549{$record->telefono}?text=" . urlencode($mensaje);
                        redirect()->away($url);
                    }),

                Tables\Actions\Action::make('pase')
                    ->label('Pase')
                    ->icon('heroicon-m-paper-airplane')
                    ->color('primary')
                    ->modalHeading('Realizar Pase de Expediente')
                    ->form([
                        Forms\Components\Select::make('area_destino')
                            ->label('Nueva Área')
                            ->options(Area::class)
                            ->required(),

                        Forms\Components\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('enviado_por')
                                ->label('Entregado por (Físico)')
                                ->default(fn() => Auth::user()->name)
                                ->required(),

                            Forms\Components\TextInput::make('recibido_por')
                                ->label('Recibido por (Físico)')
                                ->placeholder('Nombre de quien firma')
                                ->required(),
                        ]),

                        Forms\Components\Textarea::make('observaciones')
                            ->label('Observaciones del pase')
                            ->rows(2),
                    ])
                    ->action(function (Expediente $record, array $data) {
                        // 1. Guardar en el historial (Movimientos)
                        MovimientoExpediente::create([
                            'expediente_id' => $record->id,
                            'user_id' => Auth::id(), 
                            'area_origen' => $record->area_actual,
                            'area_destino' => $data['area_destino'],
                            'fecha_pase' => now(),
                            'observaciones' => $data['observaciones'],
                            'enviado_por' => $data['enviado_por'],
                            'recibido_por' => $data['recibido_por'],
                        ]);

                        // 2. Actualizar el Expediente
                        $record->update([
                            'area_actual' => $data['area_destino'],
                            'estado' => 'en_tramite',
                        ]);

                        // CORRECCIÓN AQUÍ: Convertimos el string al Enum para obtener el nombre
                        $nombreDestino = Area::tryFrom($data['area_destino'])?->name ?? $data['area_destino'];

                        // 3. Notificación visual
                        Notification::make()
                            ->title('Pase registrado exitosamente')
                            ->success()
                            ->send();
                    }),

                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\MovimientosRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListExpedientes::route('/'),
            'create' => Pages\CreateExpediente::route('/create'),
            'edit' => Pages\EditExpediente::route('/{record}/edit'),
        ];
    }
}