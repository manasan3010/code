<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GeneralData extends Model
{

    protected $guarded = [];

    public static function fgh()
    {
        GeneralData::create([
            'key' => 'name',
            'value' => 'email',
        ]);
    }

    public static function gett($key)
    {
        return GeneralData::all()->$key;
    }
}
