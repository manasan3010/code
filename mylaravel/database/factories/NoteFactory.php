<?php

/* @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Note;
use Illuminate\Support\Str;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(Note::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence($nbWords = 6, $variableNbWords = true),  // Random task title
        'description' => $faker->image('public/storage/images', 640, 480, null, false) // Random task description
    ];
});
