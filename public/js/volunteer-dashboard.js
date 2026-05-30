async function loadProfile() {
    const res = await fetch('/api/volunteers/me');
    if (!res.ok) { window.location.href = '/login'; return; }
    const data = await res.json();

    document.getElementById('profileInfo').innerHTML = `
        <div class="profile-info">
            <p>שם: <span>${data.name}</span></p>
            <p>טלפון: <span>${data.phone}</span></p>
            <p>גודל קבוצה: <span>${data.group_size}</span></p>
            <p>מיומנויות: <span>${data.skills || '-'}</span></p>
        </div>
    `;

    document.getElementById('name').value       = data.name;
    document.getElementById('phone').value      = data.phone;
    document.getElementById('group_size').value = data.group_size;
    document.getElementById('skills').value     = data.skills || '';
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
        skills:     document.getElementById('skills').value,
    };
    const res  = await fetch('/api/volunteers/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) { alert(data.message); loadProfile(); toggleEditProfile(); }
    else alert(data.error);
});

async function loadOpenTasks() {
    const res   = await fetch('/api/tasks?status=open');
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('openTasks').innerHTML = '<p class="loading">אין משימות פתוחות כרגע</p>';
        return;
    }

    document.getElementById('openTasks').innerHTML = tasks.slice(0, 5).map(t => `
        <div class="task-card">
            <h4>${t.title}</h4>
            <p>🚜 ${t.farmer_name} | 📍 ${t.location}</p>
            <p>🌱 ${t.work_type} | 📅 ${formatDate(t.start_date)}</p>
            <button class="btn btn-primary" onclick="assignTask(${t.id})">הרשם</button>
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
        document.getElementById('myTasks').innerHTML = '<p class="loading">לא נרשמת למשימות עדיין</p>';
        return;
    }

    document.getElementById('myTasks').innerHTML = `
        <table>
            <thead><tr><th>כותרת</th><th>חקלאי</th><th>מיקום</th><th>טלפון חקלאי</th><th>תאריך</th><th>סטטוס</th></tr></thead>
            <tbody>
                ${tasks.map(t => `
                    <tr>
                        <td>${t.title}</td>
                        <td>${t.farmer_name}</td>
                        <td>${t.location}</td>
                        <td>${t.farmer_phone}</td>
                        <td>${formatDate(t.start_date)}</td>
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
