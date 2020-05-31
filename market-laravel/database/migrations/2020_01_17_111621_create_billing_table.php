<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBillingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('billing', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('userId');
            $table->mediumText('addr1')->nullable();
            $table->mediumText('addr2')->nullable();
            $table->mediumText('companyName')->nullable();
            $table->mediumText('country')->nullable();
            $table->mediumText('fName')->nullable();
            $table->mediumText('faxNo')->nullable();
            $table->mediumText('lName')->nullable();
            $table->mediumText('mName')->nullable();
            $table->mediumText('message')->nullable();
            $table->mediumText('mobileNo')->nullable();
            $table->mediumText('state')->nullable();
            $table->mediumText('city')->nullable();
            $table->mediumText('title')->nullable();
            $table->mediumText('zip')->nullable();
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
        Schema::dropIfExists('billing');
    }
}
