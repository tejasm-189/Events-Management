const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupLogin();
    setupLogout();
});

function getToken() {
    return localStorage.getItem('token');
}

function checkAuth() {
    const token = getToken();
    const path = window.location.pathname;

    if (token) {
        document.getElementById('logout-btn')?.classList.remove('hidden');
        if (path === '/login') {
            window.location.href = '/dashboard';
        } else if (path === '/dashboard') {
            fetchEvents();
        }
    } else {
        if (path !== '/login' && path !== '/') {
            window.location.href = '/login';
        }
    }
}

function setupLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        const submitBtn = loginForm.querySelector('button');

        try {
            submitBtn.classList.add('loading');
            errorDiv.textContent = '';

            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            // Optionally save user data
            window.location.href = '/dashboard';

        } catch (err) {
            errorDiv.textContent = err.message;
        } finally {
            submitBtn.classList.remove('loading');
        }
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Accept': 'application/json'
                }
            });
        } catch (e) {
            console.error(e);
        } finally {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    });
}

async function fetchEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}/events?include=user,attendees`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        const json = await response.json();
        const events = json.data;

        grid.innerHTML = '';

        if (events.length === 0) {
            grid.innerHTML = '<p style="color:var(--text-muted)">No events found.</p>';
            return;
        }

        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const date = new Date(event.start_time).toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            const attendeeCount = event.attendees ? event.attendees.length : 0;

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
                    <span class="badge">Event</span>
                    <span style="color:var(--text-muted); font-size:0.875rem;">${date}</span>
                </div>
                <h3 style="margin:0 0 0.5rem 0; font-size:1.25rem;">${event.name}</h3>
                <p style="color:var(--text-muted); margin-bottom:1.5rem; line-height:1.5;">${event.description || 'No description provided.'}</p>
                
                <div style="border-top:1px solid var(--border); padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span style="font-size:0.875rem; color: #94a3b8;">Hosted by ${event.user.name}</span>
                    </div>
                    <span class="badge" style="background:var(--border); color:var(--text-main);">
                        ${attendeeCount} ${attendeeCount === 1 ? 'Attendee' : 'Attendees'}
                    </span>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (e) {
        grid.innerHTML = '<p style="color:var(--danger)">Failed to load events.</p>';
    }
}
