<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events Manager</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
</head>

<body>
    <nav>
        <a href="/" class="nav-brand">EventsManager</a>
        <div id="auth-section">
            <span id="user-info" class="hidden"></span>
            <button id="logout-btn" class="btn btn-danger hidden">Sign Out</button>
        </div>
    </nav>

    <main class="container">
        @yield('content')
    </main>

    <script src="{{ asset('js/app.js') }}"></script>
</body>

</html>