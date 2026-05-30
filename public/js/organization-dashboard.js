async function loadReport() {
    const res  = await fetch('/api/organizations/report');
    if (!res.ok) { window.location.href = '/login'; return; }
    const data = await res.json();

    document.getElementById('totalFarmers').textContent    = data.totalFarmers;
    document.getElementById('totalVolunteers').textContent = data.totalVolunteers;
    document.getElementById('openTasks').textContent       = data.openTasks;
    document.getElementById('completedTasks').textContent  = data.completedTasks;
    document.getElementById('farmersHelped').textContent   = data.farmersHelped;
    document.getElementById('farmersWaiting').textContent  = data.farmersWaiting;
}

async function loadAllTasks() {
    const status = document.getElementById('filterStatus').value;
    let url = '/api/organizations/tasks';
    if (status) url += `?status=${status}`;

    const res   = await fetch(url);
    const tasks = await res.json();

    if (!tasks.length) {
        document.getElementById('allTasks').innerHTML = '<p class="loading">אין משימות</p>';
        return;
    }

    document.getElementById('allTasks').innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>כותרת</th><th>חקלאי</th><th>מיקום</th>
                    <th>מתנדב</th><th>סוג עבודה</th>
                    <th>תאריך התחלה</th><th>סטטוס</th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(t => `
                    <tr>
                        <td>${t.title}</td>
                        <td>${t.farmer_name}</td>
                        <td>${t.location}</td>
                        <td>${t.volunteer_name || '-'}</td>
                        <td>${t.work_type}</td>
                        <td>${formatDate(t.start_date)}</td>
                        <td><span class="status-badge status-${t.status}">${translateStatus(t.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

loadReport();
loadAllTasks();
