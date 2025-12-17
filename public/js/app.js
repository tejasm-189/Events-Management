const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupLogin();
    setupLogout();

    const context = window.PAGE_CONTEXT || (window.location.pathname === '/dashboard' ? 'dashboard' : '');
    
    if (context === 'dashboard') {
        fetchEvents();
    } else if (context === 'create-event') {
        setupCreatePage();
    } else if (context === 'edit-event') {
        setupEditPage(window.EVENT_ID);
    } else if (context === 'show-event') {
        setupShowPage(window.EVENT_ID);
    }
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
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('token', data.token);
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
                headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
            });
        } catch (e) { console.error(e); } 
        finally {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    });
}

/* --- DASHBOARD --- */
async function fetchEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    try {
        const response = await fetch(`${API_URL}/events?include=user,attendees`, {
            headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
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
            card.style.cursor = 'pointer';
            card.onclick = (e) => {
                // Prevent navigation if clicking buttons inside (if any)
                if (e.target.tagName === 'BUTTON') return;
                window.location.href = `/events/${event.id}`;
            };
            
            const date = new Date(event.start_time).toLocaleDateString(undefined, {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1rem;">
                    <span class="badge">Event</span>
                    <span style="color:var(--text-muted); font-size:0.875rem;">${date}</span>
                </div>
                <h3 style="margin:0 0 0.5rem 0; font-size:1.25rem;">${event.name}</h3>
                <p style="color:var(--text-muted); margin-bottom:1.5rem; line-height:1.5;">${event.description || 'No description provided.'}</p>
                <div style="border-top:1px solid var(--border); padding-top:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.875rem; color: #94a3b8;">Hosted by ${event.user.name}</span>
                    <span class="badge" style="background:var(--border); color:var(--text-main);">
                        ${event.attendees ? event.attendees.length : 0} Attendees
                    </span>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (e) {
        grid.innerHTML = '<p style="color:var(--danger)">Failed to load events.</p>';
    }
}

/* --- CREATE PAGE --- */
function setupCreatePage() {
    const form = document.getElementById('create-event-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const errorDiv = document.getElementById('form-error');
        
        try {
            submitBtn.textContent = 'Creating...';
            submitBtn.disabled = true;
            errorDiv.textContent = '';

            const payload = {
                name: document.getElementById('event-name').value,
                description: document.getElementById('event-desc').value,
                start_time: document.getElementById('event-start').value,
                end_time: document.getElementById('event-end').value
            };

            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    throw new Error(Object.values(data.errors).flat().join('\n'));
                }
                throw new Error(data.message || 'Failed to create event');
            }

            showToast('Event created successfully!', 'success');
            setTimeout(() => window.location.href = '/dashboard', 1000);

        } catch (err) {
            errorDiv.innerText = err.message;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Event';
        }
    };
}

/* --- SHOW PAGE --- */
async function setupShowPage(id) {
    const card = document.getElementById('show-card');
    try {
        const response = await fetch(`${API_URL}/events/${id}?include=user,attendees`, {
            headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
        });

        if (!response.ok) {
            if (response.status === 404) {
                 card.innerHTML = '<h2>Event not found</h2>';
                 return;
            }
            throw new Error('Failed to load');
        }

        const json = await response.json();
        const event = json.data;
        const isOwner = true; // Ideally we check against user ID from token payload or API "can" attribute.

        const dateStart = new Date(event.start_time).toLocaleString();
        const dateEnd = new Date(event.end_time).toLocaleString();

        card.classList.remove('loading');
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:1.5rem">
                <div>
                    <span class="badge" style="margin-bottom:0.5rem; display:inline-block">Event Details</span>
                    <h1 style="margin:0; font-size:2rem">${event.name}</h1>
                    <p style="color:var(--text-muted)">Hosted by ${event.user.name}</p>
                </div>
                <div style="display:flex; gap:0.5rem">
                     <a href="/events/${event.id}/edit" class="btn btn-primary">Edit</a>
                     <button class="btn btn-danger" onclick="deleteEvent(${event.id})">Delete</button>
                </div>
            </div>

            <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 2rem; margin-bottom: 2rem">
                <div>
                    <h3>Description</h3>
                    <p style="line-height:1.6; color:var(--text-muted)">${event.description || 'No description provided.'}</p>
                </div>
                <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 0.5rem">
                    <h3 style="margin-top:0">Timing</h3>
                    <div style="margin-bottom:1rem">
                        <small style="color:var(--text-muted)">Start</small>
                        <div style="font-weight:600">${dateStart}</div>
                    </div>
                    <div>
                        <small style="color:var(--text-muted)">End</small>
                        <div style="font-weight:600">${dateEnd}</div>
                    </div>
                </div>
            </div>

            <h3>Attendees (${event.attendees.length})</h3>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
                ${event.attendees.length ? event.attendees.map(a => 
                    `<span class="badge" style="background:var(--border); color:white">${a.user?.name || 'User ' + a.user_id}</span>`
                ).join('') : '<span style="color:var(--text-muted)">No attendees yet.</span>'}
            </div>
        `;

    } catch (e) {
        card.innerHTML = '<p style="color:var(--danger)">Failed to load event details.</p>';
    }
}

/* --- EDIT PAGE --- */
async function setupEditPage(id) {
    const form = document.getElementById('edit-event-form');
    // Load data first
    try {
        const response = await fetch(`${API_URL}/events/${id}`, {
            headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
        });
        const json = await response.json();
        const event = json.data;

        // Populate form
        document.getElementById('event-name').value = event.name;
        document.getElementById('event-desc').value = event.description || '';
        document.getElementById('event-start').value = formatDateTimeForInput(event.start_time);
        document.getElementById('event-end').value = formatDateTimeForInput(event.end_time);

        document.getElementById('edit-card').classList.remove('loading');

        // Setup Delete button logic here too if desired
        document.getElementById('delete-btn').onclick = (e) => {
            e.preventDefault();
            deleteEvent(id);
        };

    } catch (e) {
        // Handle error
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const errorDiv = document.getElementById('form-error');
        
        try {
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;
            errorDiv.textContent = '';

            const payload = {
                name: document.getElementById('event-name').value,
                description: document.getElementById('event-desc').value,
                start_time: document.getElementById('event-start').value,
                end_time: document.getElementById('event-end').value
            };

            const response = await fetch(`${API_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) throw new Error(Object.values(data.errors).flat().join('\n'));
                throw new Error(data.message || 'Failed to update');
            }

            showToast('Event updated successfully!', 'success');
            setTimeout(() => window.location.href = `/events/${id}`, 1000);

        } catch (err) {
            errorDiv.innerText = err.message;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Event';
        }
    };
}

/* --- HELPERS --- */
function formatDateTimeForInput(isoString) {
    // Converts ISO string to YYYY-MM-DDTHH:mm format required by input type=datetime-local
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
}

window.deleteEvent = async function(id) {
    if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) return;

    try {
        const response = await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
        });

        if (response.status === 204) {
            showToast('Event deleted successfully.');
            setTimeout(() => window.location.href = '/dashboard', 1000);
            return;
        }

        const data = await response.json();
        throw new Error(data.message || 'Failed to delete event');
    } catch (e) {
        showToast(e.message || 'Error deleting event', 'error');
    }
};

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.textContent = message;
    toast.style.borderColor = type === 'error' ? 'var(--danger)' : 'var(--success)';
    toast.style.color = type === 'error' ? 'var(--danger)' : 'var(--success)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
