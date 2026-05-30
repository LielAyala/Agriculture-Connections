let currentPeriod = 'all';

function setPeriod(period, btn) {
    currentPeriod = period;
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadReport();
    loadAllTasks();
    loadActiveVolunteers();
    loadFarmersStatus();
}

function showTab(tab, btn) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-tasks').classList.add('hidden');
    document.getElementById('tab-volunteers').classList.add('hidden');
    document.getElementById('tab-farmers').classList.add('hidden');
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
}

async function loadReport() {
    const res = await fetch(`/api/organizations/report?period=${currentPeriod}`);
    if (!res.ok) { window.location.href = '/login'; return; }
    const d = await res.json();

    document.getElementById('totalFarmers').textContent    = d.totalFarmers;
    document.getElementById('totalVolunteers').textContent = d.totalVolunteers;
    document.getElementById('openTasks').textContent       = d.openTasks;
    document.getElementById('assignedTasks').textContent   = d.assignedTasks;
    document.getElementById('completedTasks').textContent  = d.completedTasks;
    document.getElementById('farmersHelped').textContent   = d.farmersHelped;
    document.getElementById('farmersWaiting').textContent  = d.farmersWaiting;
}

async function loadAllTasks() {
    const status = document.getElementById('filterStatus').value;
    let url = `/api/organizations/tasks?period=${currentPeriod}`;
    if (status) url += `&status=${status}`;

    const res   = await fetch(url);
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('allTasks').innerHTML = '<p class="loading">אין התנדבויות</p>';
        return;
    }

    document.getElementById('allTasks').innerHTML = `
        <table>
            <thead><tr>
                <th>כותרת</th><th>חקלאי</th><th>מיקום</th>
                <th>מתנדב / קבוצה</th><th>גודל קבוצה</th>
                <th>תאריך</th><th>שעות</th><th>סטטוס</th>
            </tr></thead>
            <tbody>
                ${tasks.map(t => `
                    <tr>
                        <td>${t.title}</td>
                        <td>${t.farmer_name}</td>
                        <td>${t.location}</td>
                        <td>${t.volunteer_name || '-'}</td>
                        <td>${t.group_size || '-'}</td>
                        <td>${formatDate(t.start_date)}</td>
                        <td>${t.work_hours || '-'}</td>
                        <td><span class="status-badge status-${t.status}">${translateStatus(t.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadActiveVolunteers() {
    const res  = await fetch(`/api/organizations/volunteers?period=${currentPeriod}`);
    const rows = await res.json();

    if (!rows.length) {
        document.getElementById('activeVolunteers').innerHTML = '<p class="loading">אין קבוצות שיצאו עדיין</p>';
        return;
    }

    document.getElementById('activeVolunteers').innerHTML = `
        <table>
            <thead><tr>
                <th>שם מתנדב/קבוצה</th><th>טלפון</th><th>גודל קבוצה</th>
                <th>משימה</th><th>חקלאי</th><th>מיקום</th><th>תאריך</th><th>סטטוס</th>
            </tr></thead>
            <tbody>
                ${rows.map(r => `
                    <tr>
                        <td>${r.name} ${r.is_group ? '👥' : '👤'}</td>
                        <td>${r.phone}</td>
                        <td>${r.group_size}</td>
                        <td>${r.title}</td>
                        <td>${r.farmer_name}</td>
                        <td>${r.location}</td>
                        <td>${formatDate(r.start_date)}</td>
                        <td><span class="status-badge status-${r.status}">${translateStatus(r.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadFarmersStatus() {
    const res  = await fetch('/api/organizations/farmers');
    const rows = await res.json();

    if (!rows.length) {
        document.getElementById('farmersStatus').innerHTML = '<p class="loading">אין חקלאים רשומים</p>';
        return;
    }

    document.getElementById('farmersStatus').innerHTML = `
        <table>
            <thead><tr>
                <th>שם חקלאי</th><th>מיקום</th><th>טלפון</th>
                <th>דונמים</th><th>גידול</th>
                <th>ממתין לסיוע</th><th>קיבל סיוע</th>
            </tr></thead>
            <tbody>
                ${rows.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td>${r.location}</td>
                        <td>${r.phone}</td>
                        <td>${r.dunams}</td>
                        <td>${r.crop_type || '-'}</td>
                        <td>${r.tasks_waiting > 0 ? `<span style="color:#e53935;font-weight:bold">${r.tasks_waiting} ⚠️</span>` : '0'}</td>
                        <td>${r.tasks_helped > 0  ? `<span style="color:#2d7a3a;font-weight:bold">${r.tasks_helped} ✓</span>` : '0'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

loadReport();
loadAllTasks();
loadActiveVolunteers();
loadFarmersStatus();
