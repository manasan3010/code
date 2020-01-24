<?php

namespace App\Http\Controllers;

use \App\Http\Controllers\GeneralDataController;

use Illuminate\Http\Request;
use Auth;
use Faker\Provider\Image;
use Illuminate\Foundation\Auth\User;

class PagesController extends Controller
{

    public function getHome()
    {
        return view('home');
    }

    public function getAbout()
    {
        return view('layouts.appg');
    }

    public function getContact()
    {
        return view('contact');
    }


    public function getTest()
    {

        $assetPath = public_path('images/home/girl1.jpg');
        // dd($assetPath);
        header("Cache-Control: public");
        header("Content-Description: File Transfer");
        // header("Content-Disposition: attachment; filename=" . basename($assetPath));
        header("Content-type: image/jpeg");

        return readfile($assetPath);






        // return strval(Auth::user());
        return view('test');

        if (Auth::check()) return view('test');
        else return 'failed';
    }
}
