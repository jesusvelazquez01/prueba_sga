<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum Area: string implements HasLabel
{
    case REC = 'REC';
    case PRE = 'PRE';
    case DC_FC = 'DC_FC';
    case PPP = 'PPP';
    case SATE = 'SATE';
    case PP = 'PP';
    case PI = 'PI';
    case IT = 'IT';
    case LAB = 'LAB';
    case ENF = 'ENF';
    case STR = 'STR';
    case GYM = 'GYM';
    case COC = 'COC';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::REC => 'Rectoría',
            self::PRE => 'Preceptoría',
            self::DC_FC => 'Diseño Curricular y Formación Continua',
            self::PPP => 'Planificación, Programas y Proyectos',
            self::SATE => 'Servicio de Acompañamiento (SATE)',
            self::PP => 'Práctica Profesional',
            self::PI => 'Gestión Institucional',
            self::IT => 'Tecnología e Información',
            self::LAB => 'Laboratorio',
            self::ENF => 'Gabinete de Enfermería',
            self::STR => 'Streaming',
            self::GYM => 'Gimnasio',
            self::COC => 'Cocina Comedor',
        };
    }
}