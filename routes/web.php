<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');
Route::view('/login', 'auth.login')->name('login');
Route::view('/dashboard', 'dashboard')->name('dashboard');

Route::resource('events', \App\Http\Controllers\EventController::class);
