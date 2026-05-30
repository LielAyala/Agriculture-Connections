async function loadProfile() {
    const res = await fetch('/api/farmers/me');
    if (!res.ok) { window.location.href = '/login'; return; }
    const d = await res.json();

    document.getElementById('profileInfo').innerHTML = `
        <div class="profile-info">
            <p>שם: <span>${d.name}</span></p>
            <p>טלפון: <span>${d.phone}</span></p>
            <p>מיקום: <span>${d.location}</span></p>
            <p>דונמים: <span>${d.dunams}</span></p>
            <p>גידול: <span>${d.crop_type || '-'}</span></p>
        </div>
    `;
    document.getElementById('name').value      = d.name;
    document.getElementById('phone').value     = d.phone;
    document.getElementById('location').value  = d.location;
    document.getElementById('dunams').value    = d.dunams;
    document.getElementById('crop_type').value = d.crop_type || '';
}

function toggleEditProfile() {
    document.getElementById('editProfileForm').classList.toggle('hidden');
}

document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        name:      document.getElementById('name').value,
        phone:     document.getElementById('phone').value,
        location:  document.getElementById('location').value,
        dunams:    document.getElementById('dunams').value,
        crop_type: document.getElementById('crop_type').value,
    };
    const res  = await fetch('/api/farmers/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) { alert(data.message); loadProfile(); toggleEditProfile(); }
    else alert(data.error);
});

document.getElementById('newTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        title:             document.getElementById('title').value,
        description:       document.getElementById('description').value,
        work_type:         document.getElementById('work_type').value,
        volunteers_needed: document.getElementById('volunteers_needed').value,
        work_hours:        document.getElementById('work_hours').value,
        start_date:        document.getElementById('start_date').value,
        end_date:          document.getElementById('end_date').value,
    };
    const res  = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (res.ok) {
        showMsg('taskMsg', data.message, 'success');
        e.target.reset();
        loadMyTasks();
    } else {
        showMsg('taskMsg', data.error, 'error');
    }
});

async function loadMyTasks() {
    const res   = await fetch('/api/farmers/me/tasks');
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('myTasks').innerHTML = '<p class="loading">לא פרסמת התנדבויות עדיין</p>';
        return;
    }

    document.getElementById('myTasks').innerHTML = `
        <table>
            <thead><tr>
                <th>כותרת</th><th>סוג עבודה</th><th>שעות</th>
                <th>תאריך התחלה</th><th>מתנדבים דרוש</th>
                <th>סטטוס</th><th>מתנדב שובץ</th><th>פעולות</th>
            </tr></thead>
            <tbody>
                ${tasks.map(t => `
                    <tr>
                        <td>${t.title}</td>
                        <td>${t.work_type}</td>
                        <td>${t.work_hours || '-'}</td>
                        <td>${formatDate(t.start_date)}</td>
                        <td>${t.volunteers_needed}</td>
                        <td><span class="status-badge status-${t.status}">${translateStatus(t.status)}</span></td>
                        <td>${t.volunteer_name || '-'}</td>
                        <td>
                            ${t.status === 'assigned'  ? `<button class="btn btn-secondary" onclick="completeTask(${t.id})">סיים ✓</button>` : ''}
                            ${t.status === 'open'      ? `<button class="btn btn-danger"    onclick="cancelTask(${t.id})">בטל ✕</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function completeTask(id) {
    if (!confirm('לסמן התנדבות זו כהושלמה?')) return;
    const res  = await fetch(`/api/tasks/${id}/complete`, { method: 'PUT' });
    const data = await res.json();
    alert(data.message || data.error);
    loadMyTasks();
}

async function cancelTask(id) {
    if (!confirm('לבטל התנדבות זו?')) return;
    const res  = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || data.error);
    loadMyTasks();
}

loadProfile();
loadMyTasks();
