<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // AQUÍ SOLO SE CREA LA TABLA 'expedientes'
        Schema::create('expedientes', function (Blueprint $table) {
            $table->id();
            
            // Identificación
            $table->string('codigo')->unique(); 
            $table->string('asunto'); 
            $table->text('descripcion')->nullable();

            // Datos del Iniciador (Incluye Teléfono para WhatsApp)
            $table->string('iniciado_por'); 
            $table->string('dni_iniciador')->nullable(); 
            $table->string('telefono')->nullable(); // <--- Vital para WhatsApp
            
            // Estado Físico
            $table->integer('cantidad_fojas')->default(1); 
            
            // Seguimiento
            $table->string('area_actual'); 
            $table->string('estado')->default('iniciado'); 
            
            // Extras
            $table->string('archivo_digital')->nullable(); 
            $table->string('qr_code')->nullable(); 
            $table->string('barcode')->nullable(); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expedientes');
    }
};