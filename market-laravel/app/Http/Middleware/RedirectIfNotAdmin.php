<?php

namespace App\Http\Middleware;

use Closure;
use Auth;


class RedirectIfNotAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!Auth::user() || !Auth::user()->isAdmin) {
            return response('<h2>Unauthorized, You are not signed in with an Admin account <a href="/logout" >Click here to login with an Admin account</a></h2>', 401);
        }

        return $next($request);
    }
}
