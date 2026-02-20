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
        Schema::table('postulantes', function (Blueprint $table) {
             $table->enum('localidad', 
            ['San Salvador de Jujuy', 'Palpalá', 'San pedro',
             'Libertador Gral. San Martín', 'Perico', 'Humahuaca', 
             'Tilcara', 'Maimará', 'Susques', 'Abra Pampa', 'La Quiaca','Otro'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('postulantes', function (Blueprint $table) {
            //
        });
    }
};
