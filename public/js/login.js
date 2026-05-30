document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = {
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        const res  = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('msg', 'התחברת בהצלחה! מעביר...', 'success');
            setTimeout(() => {
                if (data.role === 'farmer')       window.location.href = '/farmer-dashboard';
                else if (data.role === 'volunteer') window.location.href = '/volunteer-dashboard';
                else if (data.role === 'admin') window.location.href = '/organization-dashboard';
                else window.location.href = '/';
            }, 1000);
        } else {
            showMsg('msg', data.error, 'error');
        }
    } catch (err) {
        showMsg('msg', 'שגיאה בשרת', 'error');
    }
});
