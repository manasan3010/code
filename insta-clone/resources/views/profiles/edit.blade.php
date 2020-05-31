@extends('layouts.app')

@section('content')
<div class="container " >
<form action="/profile/{{ $user->id }}" enctype="multipart/form-data" method="post" >
        @CSRF
        @method('PATCH')
        <div class="col-8 offset-2">

            <div class="row">
                <h2>Edit Profile</h1>
            </div>
           <div class="form-group row">
                            <label for="title" class="col-md-4 col-form-label">Title</label>

                                <input name="title" id="title" type="text" class="form-control @error('title') is-invalid @enderror" value="{{ old('title') ?? $user->profile->title}}" required autocomplete="title" >

                                @error('title')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                   
            </div>
           <div class="form-group row">
                            <label for="title" class="col-md-4 col-form-label">Description</label>

                                <input name="description" id="description" type="text" class="form-control @error('description') is-invalid @enderror" value="{{ old('description') ?? $user->profile->description}}" required autocomplete="description" >

                                @error('description')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                   
            </div>
           <div class="form-group row">
                            <label for="url" class="col-md-4 col-form-label">URL</label>

                                <input name="url" id="url" type="text" class="form-control @error('url') is-invalid @enderror" value="{{ old('url') ?? $user->profile->url}}" required autocomplete="url" >

                                @error('url')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                   
            </div>

            <div class="row">
                <label for="image" class="col-md-4 col-form-label">Profile Image</label>
                <input type="file" class="form-control-file" id='image' name='image' >

                @error('image')
                    <strong>{{ $message }}</strong>
                @enderror
            </div>

            <div class="row pt-4 ">
                <button class="btn-primary btn " style="margin-left: auto;;" >Save Profile</button>
            </div>
         </div>
    </form>
</div>
@endsection