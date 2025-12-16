<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::define('update-event', function ($user, $event) {
            return $user->id === $event->user_id;
        });

        \Illuminate\Support\Facades\Gate::define('delete-event', function ($user, $event) {
            return $user->id === $event->user_id;
        });
    }
}
