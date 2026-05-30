let currentPeriod = 'all';
let allFarmersData = [];

// --- תקופה ---
function setPeriod(period, btn) {
    currentPeriod = period;
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    loadReport();
    loadAllTasks();
    loadActiveVolunteers();
    loadFarmersStatus();
}

// --- טאבים ---
function showTab(tab, btn) {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    if (btn) {
        btn.classList.add('active');
    } else {
        const b = document.getElementById(`btn-${tab}`);
        if (b) b.classList.add('active');
    }
    document.getElementById('tab-tasks').classList.add('hidden');
    document.getElementById('tab-volunteers').classList.add('hidden');
    document.getElementById('tab-farmers').classList.add('hidden');
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
}

// --- לחיצה על קוביה - פילטר התנדבויות לפי סטטוס ---
function filterAndShow(status) {
    showTab('tasks', null);
    document.getElementById('filterStatus').value = status;

    const titles = { open: 'התנדבויות פתוחות', assigned: 'התנדבויות בתהליך', completed: 'התנדבויות שהושלמו' };
    document.getElementById('tasksTitle').textContent = titles[status] || 'כל ההתנדבויות';

    loadAllTasks();
    scrollToData();
}

// --- לחיצה על קוביה - פילטר חקלאים ---
function showFarmersFiltered(filter) {
    showTab('farmers', null);
    document.getElementById('filterFarmers').value = filter;
    applyFarmerFilter();
    scrollToData();
}

function applyFarmerFilter() {
    const filter = document.getElementById('filterFarmers').value;
    const titles = { all: 'סטטוס כל החקלאים', helped: 'חקלאים שקיבלו סיוע ✓', waiting: 'חקלאים ממתינים לסיוע ⚠️' };
    document.getElementById('farmersTitle').textContent = titles[filter];

    let rows = allFarmersData;
    if (filter === 'helped')  rows = allFarmersData.filter(r => r.tasks_helped  > 0);
    if (filter === 'waiting') rows = allFarmersData.filter(r => r.tasks_waiting > 0);
    renderFarmers(rows);
}

function scrollToData() {
    document.getElementById('viewTabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- טעינת סטטיסטיקות ---
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

// --- טעינת כל ההתנדבויות ---
async function loadAllTasks() {
    const status = document.getElementById('filterStatus').value;
    let url = `/api/organizations/tasks?period=${currentPeriod}`;
    if (status) url += `&status=${status}`;

    const res   = await fetch(url);
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('allTasks').innerHTML = '<p class="loading">אין התנדבויות להצגה</p>';
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
                        <td>${t.volunteer_name || '<span style="color:#aaa">טרם שובץ</span>'}</td>
                        <td>${t.group_size     || '-'}</td>
                        <td>${formatDate(t.start_date)}</td>
                        <td>${t.work_hours     || '-'}</td>
                        <td><span class="status-badge status-${t.status}">${translateStatus(t.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// --- קבוצות שיצאו ---
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

// --- סטטוס חקלאים ---
async function loadFarmersStatus() {
    const res  = await fetch('/api/organizations/farmers');
    allFarmersData = await res.json();
    applyFarmerFilter();
}

function renderFarmers(rows) {
    if (!rows.length) {
        document.getElementById('farmersStatus').innerHTML = '<p class="loading">אין חקלאים להצגה</p>';
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
                        <td>${r.tasks_waiting > 0
                            ? `<span class="badge-waiting">${r.tasks_waiting} ⚠️</span>`
                            : '<span style="color:#aaa">0</span>'}</td>
                        <td>${r.tasks_helped > 0
                            ? `<span class="badge-helped">${r.tasks_helped} ✓</span>`
                            : '<span style="color:#aaa">0</span>'}</td>
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
