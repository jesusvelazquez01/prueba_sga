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
        // AQUÍ SOLO SE CREA LA TABLA 'movimiento_expedientes'
        Schema::create('movimiento_expedientes', function (Blueprint $table) {
            $table->id();
            
            // RELACIONES
            // Si borras el expediente, se borra su historial (cascade)
            $table->foreignId('expediente_id')->constrained('expedientes')->onDelete('cascade');
            
            // Usuario del sistema que hace el click (auditoría)
            $table->foreignId('user_id')->constrained('users'); 

            // DATOS DEL PASE
            $table->string('area_origen');  
            $table->string('area_destino'); 
            $table->dateTime('fecha_pase'); 
            
            // CAMPOS MANUALES (Quién entrega y quién recibe físicamente)
            $table->string('enviado_por')->nullable();  
            $table->string('recibido_por')->nullable(); 

            $table->text('observaciones')->nullable();
            $table->dateTime('fecha_recepcion')->nullable(); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimiento_expedientes');
    }
};