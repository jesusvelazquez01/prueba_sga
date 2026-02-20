<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <title>Ficha Permiso de Examen 2026</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 2cm;
            /* Margen estándar de impresión */
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            margin: 0 auto;
        }

        /* Encabezado */
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #444;
            padding-bottom: 15px;
        }

        .header img {
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
        }

        .title {
            font-weight: bold;
            font-size: 16px;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Sección de Datos Personales */
        .data-section {
            margin-bottom: 25px;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }

        .data-section p {
            margin: 6px 0;
            border-bottom: 1px dotted #ccc;
            padding-bottom: 2px;
        }

        .data-section strong {
            color: #555;
            font-size: 10px;
            text-transform: uppercase;
        }

        /* Tabla de Materias */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            table-layout: fixed;
        }

        th,
        td {
            border: 1px solid #666;
            padding: 8px 4px;
            text-align: center;
            word-wrap: break-word;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9px;
        }

        tbody tr:nth-child(even) {
            background-color: #fafafa;
        }

        .row-materia {
            height: 30px;
        }

        /* Notas e Importante */
        .important {
            margin-top: 30px;
            padding: 10px;
            border: 1px solid #000;
            font-size: 10px;
            background-color: #fff;
            text-align: justify;
        }

        .footer-area {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }

        .footer-date {
            font-size: 11px;
        }

        .signature-space {
            margin-top: 50px;
            text-align: right;
            font-style: italic;
        }
    </style>
</head>

<body>

    <div class="container">

        <div class="header">
            <img src="{{ public_path('EncPermisoExamen.png') }}" alt="Encabezado">
            <div class="title">Ficha Permiso de Examen 2026</div>
        </div>

        <div class="data-section">
            <p><strong>Tecnicatura/Carrera:</strong> {{ $ficha->carrera->nombre }}</p>
            <p><strong>Apellido y Nombres:</strong> {{ $ficha->apellido }}, {{ $ficha->nombres }}</p>
            <p>
                <strong>D.N.I. Nº:</strong> {{ $ficha->dni }}
                <span style="margin-left: 50px;"><strong>Teléfono:</strong> {{ $ficha->telefono }}</span>
            </p>
        </div>

        @php
        $materias = $ficha->materias ?? [];
        $materias = is_array($materias) ? array_values($materias) : [];
        $rowCount = 8;
        @endphp

        <table>
            <thead>
                <tr>
                    <th rowspan="2" style="width:5%">N°</th>
                    <th rowspan="2" style="width:35%">Nombre de la Materia</th>
                    <th rowspan="2" style="width:15%">Año de Cursada</th>
                    <th colspan="2">Condición</th>
                    <th colspan="2">Fecha Examen</th>
                </tr>
                <tr>
                    <th style="width:10%">Regular</th>
                    <th style="width:10%">Libre</th>
                    <th style="width:10%">Día</th>
                    <th style="width:10%">Mes</th>
                </tr>
            </thead>
            <tbody>
                @for ($i = 0; $i < $rowCount; $i++)
                    @php
                    $materia=$materias[$i] ?? null;
                    $dia='' ; $mes='' ;
                    if (!empty($materia['fecha_examen'])) {
                    try {
                    $dt=\Carbon\Carbon::parse($materia['fecha_examen']);
                    $dia=$dt->format('d');
                    $mes = $dt->format('m');
                    } catch (\Exception $e) {}
                    }
                    $condicion = strtoupper($materia['condicion'] ?? '');
                    @endphp
                    <tr class="row-materia">
                        <td>{{ $materia['num_materia'] ?? ($i + 1) }}</td>
                        <td style="text-align: left; padding-left: 10px;">{{ $materia['nombre'] ?? '' }}</td>
                        <td>{{ $materia['anio'] ?? '' }}</td>
                        <td>{{ $condicion === 'REGULAR' ? 'X' : '' }}</td>
                        <td>{{ $condicion === 'LIBRE' ? 'X' : '' }}</td>
                        <td>{{ $dia }}</td>
                        <td>{{ $mes }}</td>
                    </tr>
                    @endfor
            </tbody>
        </table>

        <div class="important">
            <strong>IMPORTANTE:</strong> Por la presente tomo conocimiento que la inscripción debe ajustarse estrictamente al
            <strong>RÉGIMEN DE CORRELATIVIDADES</strong> y a las fechas publicadas por la institución.
            Caso contrario, la inscripción <strong>NO TENDRÁ VALIDEZ</strong> en los espacios que no cumplan con estos requisitos.
            Los formularios que no posean el sello original de la Institución no serán considerados válidos.
        </div>

        <div class="footer-area">
            <div class="footer-date">
                <strong>Fecha de presentación:</strong> ........ / ........ / 2026
            </div>

        </div>
    </div>

</body>

</html>