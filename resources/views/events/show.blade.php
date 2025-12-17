@extends('layouts.app')

@section('content')
<div style="max-width: 800px; margin: 0 auto;">
    <a href="/dashboard" class="btn" style="color: var(--text-muted); padding-left: 0; margin-bottom: 1rem;">
        &larr; Back to Dashboard
    </a>

    <div class="card loading" id="show-card">
        <!-- Content loaded via JS -->
    </div>
</div>

<div id="toast" class="toast"></div>

<script>
    window.PAGE_CONTEXT = 'show-event';
    window.EVENT_ID = "{{ $id }}";
</script>
@endsection