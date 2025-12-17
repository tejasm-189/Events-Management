@extends('layouts.app')

@section('content')
<div style="max-width: 600px; margin: 0 auto;">
    <a href="/dashboard" class="btn" style="color: var(--text-muted); padding-left: 0; margin-bottom: 1rem;">
        &larr; Back to Dashboard
    </a>

    <div class="card">
        <h1 style="margin-top: 0; margin-bottom: 2rem;">Create New Event</h1>

        <form id="create-event-form">
            <div class="form-group">
                <label class="form-label">Event Name</label>
                <input type="text" id="event-name" class="form-input" required placeholder="My Awesome Event">
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea id="event-desc" class="form-input" rows="5" placeholder="What's happening?"></textarea>
            </div>

            <div class="grid" style="gap: 1rem; grid-template-columns: 1fr 1fr;">
                <div class="form-group">
                    <label class="form-label">Start Time</label>
                    <input type="datetime-local" id="event-start" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">End Time</label>
                    <input type="datetime-local" id="event-end" class="form-input" required>
                </div>
            </div>

            <div id="form-error" class="error-msg"></div>

            <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary">Create Event</button>
            </div>
        </form>
    </div>
</div>

<div id="toast" class="toast"></div>

<script>
    // Pass context to app.js if needed, or rely on URL
    window.PAGE_CONTEXT = 'create-event';
</script>
@endsection