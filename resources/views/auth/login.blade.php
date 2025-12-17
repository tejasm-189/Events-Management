@extends('layouts.app')

@section('content')
<div class="auth-container">
    <div class="logo-container">
        <h1 class="nav-brand" style="font-size: 2.5rem; margin-bottom: 0.5rem;">EventsManager</h1>
        <p style="color: var(--text-muted)">Please sign in to continue</p>
    </div>

    <div class="card">
        <form id="login-form">
            <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" id="email" class="form-input" required placeholder="user@example.com">
            </div>

            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="password" class="form-input" required>
            </div>

            <div id="login-error" class="error-msg"></div>

            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.75rem;">
                Sign In
            </button>
        </form>
    </div>
</div>
@endsection