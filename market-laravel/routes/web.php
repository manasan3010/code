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

use App\Products;

Route::get('/', 'PagesController@getHome');
Route::get('/about', 'PagesController@getAbout');
Route::get('/contact', 'PagesController@getContact');
Route::get('/logout', 'Auth\LoginController@logout');

Route::get('/checkout', 'CartController@getCheckout');
Route::get('/cart', 'CartController@getCartPage');
Route::post('/cart', 'CartController@getCart');
Route::post('/cart/add', 'CartController@addItem');
Route::post('/cart/delete', 'CartController@deleteItem');
Route::get('/checkout/submit', 'CartController@checkout');

Route::get('/product/{id}', 'ProductsController@getProduct');

Route::any('/comment/add', 'CommentsController@addComment');


Route::get('/admin', 'AdminController@getHome');
Route::get('/admin/product/edit', 'AdminController@getEditProduct');
Route::get('/admin/product/edit/submit', 'AdminController@editProduct');
Route::any('/admin/product/info', 'AdminController@getProductInfo');
Route::get('/admin/product/add', 'AdminController@getAddProduct');
Route::post('/admin/product/delete', 'AdminController@deleteProduct');
Route::post('/admin/product/add/submit', 'AdminController@addProduct');
Route::get('/admin', 'AdminController@getHome');
Route::get('/admin/transactions', function () {
    return view('admin.transactions');
});



Route::get('/test', 'PagesController@getTest');
Route::get('/test2', function () {
    return  App\Comments::all();
    // dd(\App\User::all());
    // return  \App\User::all();



    return 'true';
});


Route::get('/messages', 'MessagesController@getMessages');
Route::post('/contact/submit', 'MessagesController@submit');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
