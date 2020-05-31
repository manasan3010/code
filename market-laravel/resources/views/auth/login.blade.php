@extends('layouts.app')

@section('content')

<?php $page = session()->get( 'page' );?>

<div class="container">
    <div class="row">
        <div class="col-sm-4 col-sm-offset-1">
            <div class="login-form">
                <!--login form-->
                <h2>Login to your account</h2>
                <form method="POST" action="{{ route('login') }}">
                    @csrf
                    <input type="email" placeholder="Email Address" id="email" class=" @error('email') is-invalid @enderror" name="email" value="@if($page !='register') {{ old('email') }} @endif" required autocomplete="email" autofocus>
                    @error('email') @if($page !='register')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @endif @enderror

                    <input placeholder="Password" id="password" type="password" class="@error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                    @error('password') @if($page !='register')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @endif @enderror
                    <span style="display:inherit">

                        <input class="checkbox form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                        <label class="" for="remember">
                            Keep me signed in
                        </label>
                    </span>
                    <button type="submit" class="btn btn-default">Login</button>
                </form>
                @if (Route::has('password.request'))
                <a class="btn btn-link" href="{{ route('password.request') }}">Forgot Your Password?
                </a>
                @endif
            </div>
            <!--/login form-->
        </div>
        <div class="col-sm-1">
            <h2 class="or">OR</h2>
        </div>

        <div class="col-sm-4">
            <div class="signup-form">
                <!--sign up form-->
                <h2>New User Signup!</h2>
                <form method="POST" action="{{ route('register') }}">
                    @csrf
                    <input id="name" type="text" class=" @error('name') is-invalid @enderror" name="name" value="@if($page =='register'){{ old('name') }}@endif" required autocomplete="name" autofocus placeholder="Name">
                    @error('name') @if($page =='register')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @endif @enderror
                    <input id="email" type="email" class=" @error('email') is-invalid @enderror" name="email" value="@if($page =='register') {{ old('email') }} @endif" required autocomplete="email" placeholder="Email Address">

                    @error('email') @if($page =='register')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @endif @enderror
                    <input id="password" type="password" class=" @error('password') is-invalid @enderror" name="password" required autocomplete="new-password" placeholder="Password">
                    @error('password') @if($page =='register')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @endif @enderror
                    <input id="password-confirm" type="password" class="" name="password_confirmation" required autocomplete="new-password" placeholder="Confirm Password">
                    <button type="submit" class="btn btn-default">Signup</button>
                </form>
            </div>
            <!--/sign up form-->
        </div>
    </div>
</div>

<br><br><br>
@endsection