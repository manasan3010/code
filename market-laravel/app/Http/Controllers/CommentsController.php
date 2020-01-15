<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentsController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth', ['except' => 'getComment']);
    // }

    public function addComment(Request $request)
    {
        if(!\Auth::User()) return redirect('/login');

        $validator = Validator::make($request->all(), [
            'comment' => 'required|string|max:10000',
            'rating' => 'required',
            'productId' => 'required',
        ]);

        if ($validator->fails()) {
            
        }

        \App\Comments::create([
            'userId' => \Auth::User()->id,
            'productId' => $request->productId,
            'comment' => $request->comment,
            'rating' => $request->rating
        ]);

        return back();

    }


}
