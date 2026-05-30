// טעינת פרופיל
async function loadProfile() {
    const res  = await fetch('/api/farmers/me');
    if (!res.ok) { window.location.href = '/login'; return; }
    const data = await res.json();

    document.getElementById('profileInfo').innerHTML = `
        <div class="profile-info">
            <p>שם: <span>${data.name}</span></p>
            <p>טלפון: <span>${data.phone}</span></p>
            <p>מיקום: <span>${data.location}</span></p>
            <p>דונמים: <span>${data.dunams}</span></p>
            <p>גידול: <span>${data.crop_type || '-'}</span></p>
        </div>
    `;

    // מילוי הטופס
    document.getElementById('name').value      = data.name;
    document.getElementById('phone').value     = data.phone;
    document.getElementById('location').value  = data.location;
    document.getElementById('dunams').value    = data.dunams;
    document.getElementById('crop_type').value = data.crop_type || '';
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

// יצירת משימה
document.getElementById('newTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        title:              document.getElementById('title').value,
        description:        document.getElementById('description').value,
        work_type:          document.getElementById('work_type').value,
        volunteers_needed:  document.getElementById('volunteers_needed').value,
        start_date:         document.getElementById('start_date').value,
        end_date:           document.getElementById('end_date').value,
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

// משימות החקלאי
async function loadMyTasks() {
    const res   = await fetch('/api/farmers/me/tasks');
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('myTasks').innerHTML = '<p class="loading">אין משימות עדיין</p>';
        return;
    }

    document.getElementById('myTasks').innerHTML = `
        <table>
            <thead><tr><th>כותרת</th><th>סוג עבודה</th><th>תאריך התחלה</th><th>סטטוס</th><th>מתנדב</th><th>פעולות</th></tr></thead>
            <tbody>
                ${tasks.map(t => `
                    <tr>
                        <td>${t.title}</td>
                        <td>${t.work_type}</td>
                        <td>${formatDate(t.start_date)}</td>
                        <td><span class="status-badge status-${t.status}">${translateStatus(t.status)}</span></td>
                        <td>${t.volunteer_name || '-'}</td>
                        <td>
                            ${t.status === 'assigned' ? `<button class="btn btn-secondary" onclick="completeTask(${t.id})">סיים</button>` : ''}
                            ${t.status === 'open'     ? `<button class="btn btn-danger"    onclick="cancelTask(${t.id})">בטל</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function completeTask(id) {
    if (!confirm('לסמן משימה זו כהושלמה?')) return;
    const res  = await fetch(`/api/tasks/${id}/complete`, { method: 'PUT' });
    const data = await res.json();
    alert(data.message || data.error);
    loadMyTasks();
}

async function cancelTask(id) {
    if (!confirm('לבטל משימה זו?')) return;
    const res  = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || data.error);
    loadMyTasks();
}

loadProfile();
loadMyTasks();
