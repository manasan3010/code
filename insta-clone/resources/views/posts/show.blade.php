@extends('layouts.app')

@section('content')
<div class="container " style="">
    <div class="row">
        <div class="col-7">
            <img src="/storage/{{ $post->image }}" class="w-100">
        </div>
        <div class="col-5">
        <div>
            <img src="{{ $post->user->profile->profileImage() }}" class='w-25 rounded-circle' alt="">
            <a class="" href="/profile/{{ $post->user->id }}"><h4 class="d-inline pl-2 text-dark" style="">{{ $post->user->username }}</h4></a>
            <a class="pl-3" href="">Follow</a>

        </div>
            <p class="pt-4 " style="font-size:16px;" >{{ $post->caption }}</p>
        </div>
    </div>
</div>
@endsection