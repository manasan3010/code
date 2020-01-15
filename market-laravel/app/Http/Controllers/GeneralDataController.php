<?php

namespace App\Http\Controllers;

use App\GeneralData;

use Illuminate\Http\Request;

class GeneralDataController extends Controller
{
    public static function getTest()
    {
        // return GeneralData::get();
        return GeneralData::create([
            'key' => 'name2',
            'value' => 'email',
        ]);
    }
    public static function get()
    {
        // return GeneralData::get();
        return 'hi!!!';
    }
}
