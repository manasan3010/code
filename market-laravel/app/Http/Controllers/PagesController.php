<?php

namespace App\Http\Controllers;

use \App\Http\Controllers\GeneralDataController;

use Illuminate\Http\Request;
use Auth;
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
        // return strval(Auth::user());
        return view('test');

        if (Auth::check()) return view('test');
        else return 'failed';
    }
}
