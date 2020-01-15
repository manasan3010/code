<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Products;
use App\User;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => '']);
    }



    public function getCheckout()
    {
        // dd(json_decode(Auth::User()->billingInfo, true));
        if (!Auth::User()) return view('checkout');
        return view('checkout')->with('info', json_decode(Auth::User()->billingInfo, true))->with('cart', json_decode(Auth::User()->cart, true));
    }

    public function getCartPage()
    {
        $cart = json_decode(Auth::User()->cart, true);
        // dd($cart);
        return view('cart', compact('cart'));
    }

    public function getCart()
    {
        return view('contact');
    }

    public function addItem(Request $request)
    {
        $item = $request;
        $cart = json_decode(Auth::User()->cart, true);
        $item->id = intval($item->id);
        $item->quantity = intval($item->quantity);

        if (Products::find($item->id)) {
            $cart[$item->id] = $item->quantity;
            if ($item->quantity < 1) unset($cart[$item->id]);


            Auth::User()->cart = json_encode($cart);
            Auth::User()->save();
            return 1;
        }
        return abort(422);
        return $request;
        return var_dump($_POST);
    }

    public function deleteItem()
    {
        return view('contact');
    }

    public function checkout()
    {
        return view('contact');
    }
}
