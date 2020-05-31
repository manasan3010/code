<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\GeneralData;
use App\Http\Controllers\CartController;
use App\PayPalClient;
use App\Products;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', 'PagesController@getHome');
Route::get('/about', 'PagesController@getAbout');
Route::get('/contact', 'PagesController@getContact');
Route::get('/logout', 'Auth\LoginController@logout');

Route::any('/search', 'SearchController@search');
Route::get('/checkout', 'CartController@getCheckoutPage');
Route::get('/cart', 'CartController@getCartPage');
Route::post('/cart', 'CartController@getCart');
Route::post('/cart/add', 'CartController@addItem');
Route::post('/cart/delete', 'CartController@deleteItem');
Route::any('/checkout/submit', 'CartController@checkout');
Route::any('/paypal-transaction-complete', 'CartController@purchase');
Route::any('/create-paypal-transaction', 'CartController@createTransaction');

Route::get('/product/{id}', 'ProductsController@getProduct');
Route::get('/category/{id}', 'ProductsController@getCategory');
Route::get('/brand/{id}', 'ProductsController@getBrand');

Route::any('/comment/add', 'CommentsController@addComment');

Route::get('/resize/{url}', 'ImagesController@getImage')->where('url', '(.*)');


Route::get('/admin', 'AdminController@getHome');
Route::get('/admin/product/edit', 'AdminController@getEditProduct');
Route::get('/admin/product/edit/submit', 'AdminController@editProduct');
Route::any('/admin/product/get', 'AdminController@getProductInfo');
Route::get('/admin/product/add', 'AdminController@getAddProduct');
Route::post('/admin/product/delete', 'AdminController@deleteProduct');
Route::post('/admin/product/add/submit', 'AdminController@addProduct');
Route::get('/admin', 'AdminController@getHome');
Route::get('/admin/transactions', function () {
    return view('admin.transactions');
});



Route::get('/test', 'PagesController@getTest');
Route::get('/test2', function () {

    dd(Auth::User()->name);
    DB::table('general_data')->insert(['key' => 'featured', 'value' => json_encode(['62', '64', '63'])]);
    return;
    $cc = new CartController;
    // return $cc->purchase("11417482X6139234M");

    dd(PayPalClient::client());
    foreach (json_decode(\App\Products::find(62)->images, true) as $oldImage) {
        unlink(storage_path('app/public/image_files/' . '16-01-20_fcb0928f29.jpg'));
        echo $oldImage;
    };
    // dd(\App\User::all());
    // return  \App\User::all();



    return 'true';
});


Route::get('/messages', 'MessagesController@getMessages');
Route::post('/contact/submit', 'MessagesController@submit');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
