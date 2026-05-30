async function loadTasks() {
    const status    = document.getElementById('filterStatus').value;
    const work_type = document.getElementById('filterType').value;

    let url = '/api/tasks?';
    if (status)    url += `status=${status}&`;
    if (work_type) url += `work_type=${encodeURIComponent(work_type)}`;

    try {
        const res   = await fetch(url);
        const tasks = await res.json();

        const container = document.getElementById('tasksList');

        if (!res.ok) {
            container.innerHTML = '<p class="msg error">יש להתחבר כדי לצפות במשימות</p>';
            return;
        }

        if (tasks.length === 0) {
            container.innerHTML = '<p class="loading">אין משימות להצגה</p>';
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="task-card">
                <span class="status-badge status-${task.status}">${translateStatus(task.status)}</span>
                <h4>${task.title}</h4>
                <p>🚜 ${task.farmer_name} | 📍 ${task.location}</p>
                <p>🌱 ${task.work_type} | 👥 ${task.volunteers_needed} מתנדבים</p>
                <p>📅 ${formatDate(task.start_date)} - ${formatDate(task.end_date)}</p>
                ${task.status === 'open' ? `<button class="btn btn-primary" onclick="assignTask(${task.id})">הרשם להתנדבות</button>` : ''}
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('tasksList').innerHTML = '<p class="msg error">שגיאה בטעינת המשימות</p>';
    }
}

async function assignTask(taskId) {
    try {
        const res  = await fetch(`/api/tasks/${taskId}/assign`, { method: 'PUT' });
        const data = await res.json();
        if (res.ok) {
            alert(data.message);
            loadTasks();
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert('שגיאה בהרשמה למשימה');
    }
}

loadTasks();
