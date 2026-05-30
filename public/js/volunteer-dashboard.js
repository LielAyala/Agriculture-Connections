async function loadProfile() {
    const res = await fetch('/api/volunteers/me');
    if (!res.ok) { window.location.href = '/login'; return; }
    const d = await res.json();

    document.getElementById('profileInfo').innerHTML = `
        <div class="profile-info">
            <p>שם: <span>${d.name}</span></p>
            <p>טלפון: <span>${d.phone}</span></p>
            <p>סוג: <span>${d.is_group ? 'קבוצה' : 'יחיד'}</span></p>
            <p>גודל קבוצה: <span>${d.group_size}</span></p>
        </div>
    `;
    document.getElementById('name').value       = d.name;
    document.getElementById('phone').value      = d.phone;
    document.getElementById('group_size').value = d.group_size;
}

function toggleEditProfile() {
    document.getElementById('editProfileForm').classList.toggle('hidden');
}

document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        name:       document.getElementById('name').value,
        phone:      document.getElementById('phone').value,
        group_size: document.getElementById('group_size').value,
    };
    const res  = await fetch('/api/volunteers/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) { alert(data.message); loadProfile(); toggleEditProfile(); }
    else alert(data.error);
});

// חיפוש עם פילטרים
async function searchTasks() {
    const location   = document.getElementById('filterLocation').value.trim();
    const date       = document.getElementById('filterDate').value;
    const group_size = document.getElementById('filterGroupSize').value;
    const work_type  = document.getElementById('filterType').value;

    let url = '/api/tasks?status=open';
    if (location)   url += `&location=${encodeURIComponent(location)}`;
    if (date)       url += `&date=${date}`;
    if (group_size) url += `&group_size=${group_size}`;
    if (work_type)  url += `&work_type=${encodeURIComponent(work_type)}`;

    await loadOpenTasks(url);
}

function clearSearch() {
    document.getElementById('filterLocation').value  = '';
    document.getElementById('filterDate').value      = '';
    document.getElementById('filterGroupSize').value = '';
    document.getElementById('filterType').value      = '';
    loadOpenTasks('/api/tasks?status=open');
}

async function loadOpenTasks(url = '/api/tasks?status=open') {
    const res   = await fetch(url);
    const tasks = await res.json();
    const container = document.getElementById('openTasks');

    if (!tasks.length) {
        container.innerHTML = '<p class="loading">לא נמצאו התנדבויות מתאימות</p>';
        return;
    }

    container.innerHTML = tasks.map(t => `
        <div class="task-card">
            <span class="status-badge status-open">פתוח</span>
            <h4>${t.title}</h4>
            <p>🚜 ${t.farmer_name} &nbsp;|&nbsp; 📍 ${t.location}</p>
            <p>🌱 ${t.work_type} &nbsp;|&nbsp; 👥 ${t.volunteers_needed} מתנדבים</p>
            <p>⏰ ${t.work_hours || 'שעות לא צוינו'}</p>
            <p>📅 ${formatDate(t.start_date)} עד ${formatDate(t.end_date)}</p>
            ${t.description ? `<p style="color:#555;font-size:0.85rem">${t.description}</p>` : ''}
            <button class="btn btn-primary" onclick="assignTask(${t.id})">הרשם להתנדבות</button>
        </div>
    `).join('');
}

async function assignTask(taskId) {
    const res  = await fetch(`/api/tasks/${taskId}/assign`, { method: 'PUT' });
    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) { loadOpenTasks(); loadMyTasks(); }
}

async function loadMyTasks() {
    const res   = await fetch('/api/volunteers/me/tasks');
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('myTasks').innerHTML = '<p class="loading">לא נרשמת להתנדבויות עדיין</p>';
        return;
    }

    document.getElementById('myTasks').innerHTML = `
        <table>
            <thead><tr>
                <th>כותרת</th><th>חקלאי</th><th>מיקום</th>
                <th>טלפון חקלאי</th><th>תאריך</th><th>שעות</th><th>סטטוס</th>
            </tr></thead>
            <tbody>
                ${tasks.map(t => `
                    <tr>
                        <td>${t.title}</td>
                        <td>${t.farmer_name}</td>
                        <td>${t.location}</td>
                        <td>${t.farmer_phone}</td>
                        <td>${formatDate(t.start_date)}</td>
                        <td>${t.work_hours || '-'}</td>
                        <td><span class="status-badge status-${t.status}">${translateStatus(t.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

loadProfile();
loadOpenTasks();
loadMyTasks();
