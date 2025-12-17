@extends('layouts.app')

@section('content')
<div style="max-width: 600px; margin: 0 auto;">
    <a href="/dashboard" class="btn" style="color: var(--text-muted); padding-left: 0; margin-bottom: 1rem;">
        &larr; Back to Dashboard
    </a>

    <div class="card loading" id="edit-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h1 style="margin: 0;">Edit Event</h1>
            <button id="delete-btn" class="btn btn-danger">Delete Event</button>
        </div>

        <form id="edit-event-form">
            <input type="hidden" id="event-id" value="{{ $id }}">

            <div class="form-group">
                <label class="form-label">Event Name</label>
                <input type="text" id="event-name" class="form-input" required>
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea id="event-desc" class="form-input" rows="5"></textarea>
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
                <button type="submit" class="btn btn-primary">Update Event</button>
            </div>
        </form>
    </div>
</div>

<div id="toast" class="toast"></div>

<script>
    window.PAGE_CONTEXT = 'edit-event';
    window.EVENT_ID = "{{ $id }}";
</script>
@endsection