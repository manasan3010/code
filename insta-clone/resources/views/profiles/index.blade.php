@extends('layouts.app')

@section('content')
<div class="container ">
    <div class="row">
        <div class="col-4 p-5" style="text-align: center;">
            <img class="rounded-circle" style='height:130px;'
                src="{{ $user->profile->profileImage() }}"
                alt="">
        </div>
        <div class="col-8 pt-5 ">
            <div class="d-flex justify-content-between align-items-baseline">
                <div class="d-flex align-items-center pb-3">
                    <h1>{{ $user->username }}</h1>
                    <follow-button user-id="{{ $user->id }}" follows="{{ $follows }}"></follow-button>
                 </div>
                @can('update', $user->profile)
                <a href="/p/create">Add New Post</a>
              @endcan

            </div>
              @can('update', $user->profile)
              <a href="/profile/{{ $user->id }}/edit">Edit Profile</a>
              @endcan

              <div class="d-flex">
                <div class="pr-4"><strong>{{ $postCount }}</strong> posts</div>
                <div class="pr-4"><strong>{{ $followersCount }}</strong> followers</div>
                <div class="pr-4"><strong>{{ $followingCount }}</strong> following</div>
            </div>
            <div class="pt-4 font-weight-bold">{{ $user->profile->title }}</div>
            <div style="white-space: pre-wrap;font-size: small;">{{ $user->profile->description }}</div>
            <div><a href="//{{ $user->profile->url }}">{{ $user->profile->url ?? 'N/A' }}</a></div>


        </div>
    </div>
    <div class="row mt-5">
        @foreach($user->posts as $post)
        <div class="col-4 pb-4">
        <a href="/p/{{ $post->id }}">
            <img class="w-100" src="/storage/{{ $post->image }}"  alt="Uploaded Image">
        </a>
        </div>
        @endforeach
    </div>
</div>
@endsection