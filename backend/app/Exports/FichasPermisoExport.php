<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use Illuminate\Database\Eloquent\Builder;

class FichasPermisoExport implements
    FromQuery,
    WithHeadings,
    WithMapping,
    ShouldAutoSize,
    WithStyles,
    WithColumnFormatting
{
    protected Builder $query;

    public function __construct(Builder $query)
    {
        $this->query = $query;
    }

    public function query()
    {
        return $this->query;
    }

    public function headings(): array
    {
        return [
            'Fecha Solicitud',
            'DNI',
            'Apellido',
            'Nombres',
            'Carrera',
            'Teléfono',
            'N° Materia',
            'Nombre Materia',
            'Condición',
            'Fecha Examen',
        ];
    }

    public function map($record): array
    {
        $rows = [];

        if (!empty($record->materias)) {
            foreach ($record->materias as $materia) {
                $rows[] = [
                    $record->fecha,
                    $record->dni,
                    $record->apellido,
                    $record->nombres,
                    $record->carrera?->nombre,
                    $record->telefono,
                    $materia['num_materia'] ?? '',
                    $materia['nombre'] ?? '',
                    $materia['condicion'] ?? '',
                    $materia['fecha_examen'] ?? '',
                ];
            }
        }

        if (empty($rows)) {
            $rows[] = [
                $record->fecha,
                $record->dni,
                $record->apellido,
                $record->nombres,
                $record->carrera?->nombre,
                $record->telefono,
                '',
                '',
                '',
                '',
            ];
        }

        return $rows[0];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
            ],
        ];
    }

    public function columnFormats(): array
    {
        return [
            'A' => NumberFormat::FORMAT_DATE_DDMMYYYY,
            'J' => NumberFormat::FORMAT_DATE_DDMMYYYY,
        ];
    }
}
