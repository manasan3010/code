<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Products;
use \Auth;

class ProductsController extends Controller
{
    
    public function getProduct($id)
    {
        // dd(Products::find($id));
        // dd(json_decode(Auth::User()->billingInfo, true));
        // if(!Auth::User()) return view('checkout');
        if(!Products::find($id)) return abort(404);

        // if(!json_decode(Products::find($id)->images,true) ) $images = ['/images/product-details/no-image.png'];
        // elseif(1) $images = json_decode(Products::find($id)->images,true);

        $images = json_decode(Products::find($id)->images,true);
        return view('product',compact('images'))->with('item', Products::find($id));
    }
}
