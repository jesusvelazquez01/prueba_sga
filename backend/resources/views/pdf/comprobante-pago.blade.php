<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Comprobante de Pago</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            color: #333;
        }

        .receipt-box {
            border: 2px solid #000;
            padding: 20px;
            width: 100%;
        }

        .header {
            text-align: center;
            border-bottom: 1px solid #ccc;
            pb: 10px;
            mb: 20px;
        }

        .logo-text {
            font-size: 18px;
            font-weight: bold;
            color: #0b2e42;
        }

        .details {
            margin-bottom: 20px;
        }

        .row {
            margin-bottom: 8px;
            border-bottom: 1px dashed #eee;
            padding-bottom: 4px;
        }

        .label {
            font-weight: bold;
            color: #555;
        }

        .amount-box {
            background: #f9f9f9;
            padding: 15px;
            text-align: center;
            border: 1px solid #ddd;
        }

        .footer {
            font-size: 9px;
            text-align: center;
            margin-top: 20px;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="receipt-box">
        <div class="header">
            <div class="logo-text">INSTITUTO SUPERIOR NUEVO HORIZONTE</div>
            <p>R.M. Nº 1445-E/15 - San Salvador de Jujuy</p>
            <h3>COMPROBANTE DE PAGO ELECTRÓNICO</h3>
        </div>

        <div class="details">
            <div class="row"><span class="label">N° Operación MP:</span> {{ $ficha->payment_id }}</div>
            <div class="row"><span class="label">Fecha:</span> {{ \Carbon\Carbon::parse($ficha->updated_at)->format('d/m/Y H:i') }} hs</div>
            <div class="row"><span class="label">Alumno:</span> {{ $ficha->apellido }}, {{ $ficha->nombres }}</div>
            <div class="row"><span class="label">DNI:</span> {{ $ficha->dni }}</div>
            <div class="row"><span class="label">Concepto:</span> Derecho de Examen - {{ $ficha->carrera->nombre }}</div>
        </div>

        <div class="amount-box">
            <span style="font-size: 14px;">TOTAL ABONADO</span><br>
            <span style="font-size: 24px; font-weight: bold;">$ {{ number_format($ficha->monto, 2, ',', '.') }}</span>
        </div>

        <div class="footer">
            Este comprobante es válido únicamente con la confirmación de acreditación de Mercado Pago.<br>
            Conserve este documento para cualquier reclamo administrativo.
        </div>
    </div>
</body>

</html>