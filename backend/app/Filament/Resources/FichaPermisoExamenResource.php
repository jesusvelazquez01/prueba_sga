<?php

namespace App\Filament\Resources;

use App\Filament\Resources\FichaPermisoExamenResource\Pages;
use App\Models\FichaPermisoExamen;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;
use Barryvdh\DomPDF\Facade\Pdf;
use Filament\Tables\Actions\Action;
use App\Exports\FichasPermisoExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Collection;

class FichaPermisoExamenResource extends Resource
{
    protected static ?string $model = FichaPermisoExamen::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-check';
    protected static ?string $navigationGroup = 'Gestión Académica';
    protected static ?string $navigationLabel = 'Permisos de Examen';
    protected static ?string $pluralModelLabel = 'Permisos de Examen';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make('Estado del Trámite y Pago')
                            ->columns(3)
                            ->schema([
                                Forms\Components\Select::make('status')
                                    ->label('Estado de Pago')
                                    ->options([
                                        'pending' => 'Pendiente',
                                        'approved' => 'Aprobado (Pagado)',
                                        'rejected' => 'Rechazado / Fallido',
                                    ])
                                    ->required()
                                    ->native(false),
                                Forms\Components\TextInput::make('payment_id')
                                    ->label('ID Transacción Mercado Pago')
                                    ->readOnly()
                                    ->placeholder('Sin procesar'),
                                Forms\Components\TextInput::make('monto')
                                    ->label('Monto Abonado')
                                    ->prefix('$')
                                    ->readOnly(),
                            ]),

                        Forms\Components\Section::make('Información del Solicitante')
                            ->schema([
                                Forms\Components\Select::make('carrera_id')
                                    ->relationship('carrera', 'nombre')
                                    ->searchable()
                                    ->preload()
                                    ->required(),
                                Forms\Components\TextInput::make('dni')
                                    ->label('DNI')
                                    ->required(),
                                Forms\Components\TextInput::make('apellido')
                                    ->required(),
                                Forms\Components\TextInput::make('nombres')
                                    ->required(),
                                Forms\Components\TextInput::make('telefono')
                                    ->tel(),
                                Forms\Components\DatePicker::make('fecha')
                                    ->label('Fecha de Solicitud')
                                    ->default(now())
                                    ->required(),
                            ])->columns(2),

                        Forms\Components\Section::make('Materias Inscritas')
                            ->schema([
                                Forms\Components\Repeater::make('materias')
                                    ->label('Detalle de Materias')
                                    ->itemLabel(fn(array $state): ?string => $state['nombre'] ?? 'Nueva Materia')
                                    ->collapsible()
                                    ->schema([
                                        Forms\Components\TextInput::make('num_materia')
                                            ->label('N°'),
                                        Forms\Components\TextInput::make('nombre')
                                            ->label('Materia')
                                            ->required(),
                                        Forms\Components\TextInput::make('anio')
                                            ->label('Año Cursado'),
                                        Forms\Components\Select::make('condicion')
                                            ->options([
                                                'REGULAR' => 'Regular',
                                                'LIBRE' => 'Libre',
                                            ]),
                                        Forms\Components\DatePicker::make('fecha_examen')
                                            ->label('Fecha Examen'),
                                    ])
                                    ->columns(5)
                                    ->reorderable(false),
                            ]),
                    ])->columnSpanFull()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado Pago')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'approved' => 'success',
                        'pending' => 'warning',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state) => match ($state) {
                        'approved' => 'PAGADO',
                        'pending' => 'PENDIENTE',
                        'rejected' => 'FALLIDO',
                        default => strtoupper($state),
                    })
                    ->sortable(),

                Tables\Columns\TextColumn::make('fecha')
                    ->date('d/m/Y')
                    ->sortable()
                    ->label('Solicitud'),

                Tables\Columns\TextColumn::make('dni')
                    ->label('DNI')
                    ->searchable(),

                Tables\Columns\TextColumn::make('apellido')
                    ->searchable()
                    ->formatStateUsing(fn($state, $record) => "{$record->apellido}, {$record->nombres}")
                    ->label('Alumno'),

                Tables\Columns\TextColumn::make('carrera.nombre')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                Tables\Columns\TextColumn::make('fecha_examen')
                    ->label('Prox. Examen')
                    ->getStateUsing(function ($record) {
                        return collect($record->materias)
                            ->pluck('fecha_examen')
                            ->filter()
                            ->sort()
                            ->first();
                    })
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Filtrar por Pago')
                    ->options([
                        'approved' => 'Pagados',
                        'pending' => 'Pendientes',
                        'rejected' => 'Fallidos',
                    ]),

                SelectFilter::make('carrera_id')
                    ->relationship('carrera', 'nombre')
                    ->label('Carrera'),

                Tables\Filters\Filter::make('fecha_solicitud')
                    ->label('📅 Fecha de Solicitud')
                    ->form([
                        Forms\Components\DatePicker::make('solicitud_desde'),
                        Forms\Components\DatePicker::make('solicitud_hasta'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['solicitud_desde'], fn($q) => $q->whereDate('fecha', '>=', $data['solicitud_desde']))
                            ->when($data['solicitud_hasta'], fn($q) => $q->whereDate('fecha', '<=', $data['solicitud_hasta']));
                    }),
            ])
            ->actions([
                Action::make('descargarPdf')
                    ->label('PDF')
                    ->tooltip('Descargar Ficha de Examen')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('success')
                    ->visible(fn(FichaPermisoExamen $record) => $record->status === 'approved')
                    ->action(function (FichaPermisoExamen $record) {
                        $pdf = Pdf::loadView('pdf.ficha-permiso', ['ficha' => $record]);
                        $pdf->setPaper('a4', 'landscape');

                        return response()->streamDownload(function () use ($pdf) {
                            echo $pdf->output();
                        }, "FichaPermiso_{$record->apellido}.pdf");
                    }),

                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('exportarExcel')
                        ->label('Exportar a Excel')
                        ->icon('heroicon-o-table-cells')
                        ->color('success')
                        ->action(fn(Collection $records) => Excel::download(
                            new FichasPermisoExport($records),
                            'Listado_Permisos_Examen.xlsx'
                        )),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFichaPermisoExamens::route('/'),
            'create' => Pages\CreateFichaPermisoExamen::route('/create'),
            'edit' => Pages\EditFichaPermisoExamen::route('/{record}/edit'),
        ];
    }
}
