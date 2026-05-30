// בדיקת סטטוס התחברות בכל דף
async function checkAuth() {
    try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();

        const authLinks = document.getElementById('authLinks');
        if (!authLinks) return;

        if (data.loggedIn) {
            let dashLink = '/';
            if (data.role === 'farmer')       dashLink = '/farmer-dashboard';
            if (data.role === 'volunteer')    dashLink = '/volunteer-dashboard';
            if (data.role === 'admin') dashLink = '/organization-dashboard';

            authLinks.innerHTML = `
                <a href="${dashLink}">הדשבורד שלי</a>
                <a href="#" onclick="logout()">התנתק (${data.username})</a>
            `;

            // הסתרת כפתורי הרשמה/כניסה בדף הבית
            const heroButtons = document.getElementById('heroButtons');
            if (heroButtons) {
                heroButtons.innerHTML = `<a href="${dashLink}" class="btn btn-primary">לדשבורד שלי</a>`;
            }
        } else {
            authLinks.innerHTML = `<a href="/login">התחבר</a><a href="/register">הרשמה</a>`;
        }
    } catch (err) {
        console.error('שגיאה בבדיקת סטטוס:', err);
    }
}

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
}

// הצגת הודעה
function showMsg(elementId, text, type = 'success') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = text;
    el.className = `msg ${type}`;
}

// פורמט תאריך
function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('he-IL');
}

// תרגום סטטוס
function translateStatus(status) {
    const map = { open: 'פתוח', assigned: 'שובץ', completed: 'הושלם', cancelled: 'בוטל' };
    return map[status] || status;
}

checkAuth();
