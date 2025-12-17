@extends('layouts.app')

@section('content')
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
    <div>
        <h1 style="margin: 0; font-size: 2rem;">Dashboard</h1>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Manage your upcoming events</p>
    </div>
    <a href="{{ route('events.create') }}" class="btn btn-primary">
        + New Event
    </a>
</div>

<div id="events-grid" class="grid">
    <!-- Events will be loaded here -->
    <div class="card loading">Loading events...</div>
</div>

<div id="toast" class="toast"></div>

<script>
    window.PAGE_CONTEXT = 'dashboard';
</script>
@endsection