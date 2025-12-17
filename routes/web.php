<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'welcome');
Route::view('/login', 'auth.login')->name('login');
Route::view('/dashboard', 'dashboard')->name('dashboard');

// Event View Routes
Route::view('/events/create', 'events.create')->name('events.create');
Route::get('/events/{id}/edit', function ($id) {
    return view('events.edit', ['id' => $id]);
})->name('events.edit');
Route::get('/events/{id}', function ($id) {
    return view('events.show', ['id' => $id]);
})->name('events.show');
