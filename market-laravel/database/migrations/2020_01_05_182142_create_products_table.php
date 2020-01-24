<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /** 
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->longText('description')->nullable();
            $table->integer('rating')->nullable();
            $table->unsignedBigInteger('price')->nullable();
            $table->string('location')->nullable();
            $table->mediumText('tags')->nullable();
            $table->string('brand')->nullable();
            $table->unsignedBigInteger('current_stock')->nullable();
            $table->string('availability')->nullable();
            $table->mediumText('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
