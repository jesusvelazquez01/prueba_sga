<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CarreraResource\Pages;
use App\Models\Carrera;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CarreraResource extends Resource
{
    protected static ?string $model = Carrera::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationLabel = 'Gestión de Carreras';
    protected static ?string $modelLabel = 'Carrera';
    protected static ?string $navigationGroup = 'Académico';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Información Principal')
                            ->schema([
                                Forms\Components\TextInput::make('nombre')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(
                                        fn(string $operation, $state, Forms\Set $set) =>
                                        $operation === 'create' ? $set('slug', Str::slug($state)) : null
                                    )
                                    ->columnSpanFull(),

                                Forms\Components\TextInput::make('slug')
                                    ->required()
                                    ->disabled()
                                    ->dehydrated()
                                    ->unique(Carrera::class, 'slug', ignoreRecord: true)
                                    ->columnSpanFull(),

                                Forms\Components\TextInput::make('duracion')
                                    ->label('Duración')
                                    ->placeholder('Ej: 3 Años')
                                    ->prefixIcon('heroicon-m-clock'),

                                Forms\Components\TextInput::make('modalidad')
                                    ->label('Modalidad')
                                    ->placeholder('Ej: Presencial / Híbrido')
                                    ->prefixIcon('heroicon-m-building-library'),

                                Forms\Components\Toggle::make('activa')
                                    ->label('Publicar en la Web')
                                    ->default(true)
                                    ->onColor('success')
                                    ->offColor('danger')
                                    ->columnSpanFull(),
                            ])->columns(2),

                        Forms\Components\Section::make('Documentación PDF')
                            ->description('Sube aquí los archivos legales y académicos.')
                            ->schema([
                                Forms\Components\FileUpload::make('plan_estudio_url')
                                    ->label('Plan de Estudio (PDF)')
                                    ->acceptedFileTypes(['application/pdf'])
                                    ->directory('carreras-pdf')
                                    ->downloadable()
                                    ->openable(),

                                Forms\Components\FileUpload::make('resolucion_url')
                                    ->label('Resolución Ministerial (PDF)')
                                    ->acceptedFileTypes(['application/pdf'])
                                    ->directory('carreras-pdf')
                                    ->downloadable()
                                    ->openable(),
                            ])->columns(2),
                    ])->columnSpan(2),

                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Portada')
                            ->schema([
                                Forms\Components\FileUpload::make('imagen_url')
                                    ->label('Imagen Principal')
                                    ->image()
                                    ->imageEditor()
                                    ->directory('carreras-img')
                                    ->required(),
                            ]),

                        Forms\Components\Section::make('Resumen Web')
                            ->schema([
                                Forms\Components\Textarea::make('descripcion')
                                    ->label('Descripción Corta')
                                    ->helperText('Se muestra en la tarjeta de la carrera.')
                                    ->rows(4)
                                    ->required(),
                            ]),
                    ])->columnSpan(1),

                Forms\Components\Section::make('Detalle Completo')
                    ->schema([
                        Forms\Components\RichEditor::make('contenido')
                            ->label('Plan de Estudios y Salida Laboral')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'h2',
                                'h3',
                                'link',
                                'undo',
                                'redo'
                            ])
                            ->columnSpanFull(),
                    ]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('imagen_url')
                    ->label('Portada')
                    ->circular()
                    ->stacked(),

                Tables\Columns\TextColumn::make('nombre')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn(Carrera $record): string => Str::limit($record->descripcion, 30)),

                Tables\Columns\TextColumn::make('duracion')
                    ->icon('heroicon-m-clock')
                    ->sortable(),

                Tables\Columns\TextColumn::make('modalidad')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                // Muestra cuántos alumnos se han registrado interesados en esta carrera
                Tables\Columns\TextColumn::make('postulantes_count')
                    ->counts('postulantes')
                    ->label('Interesados')
                    ->badge()
                    ->color('warning')
                    ->sortable(),

                // Permite activar/desactivar sin entrar a editar
                Tables\Columns\ToggleColumn::make('activa')
                    ->label('Visible'),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('activa')
                    ->label('Estado de Publicación'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No hay carreras cargadas')
            ->emptyStateDescription('Crea la primera carrera para comenzar a captar alumnos.');
    }

    public static function getRelations(): array
    {
        return [
            // Aquí podríamos poner un RelationManager para ver los postulantes de esta carrera,
            // pero por ahora lo mantenemos simple.
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCarreras::route('/'),
            'create' => Pages\CreateCarrera::route('/create'),
            'edit' => Pages\EditCarrera::route('/{record}/edit'),
        ];
    }
}
