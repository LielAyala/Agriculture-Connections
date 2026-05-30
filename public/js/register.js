function selectRole(role, btn) {
    document.getElementById('role').value = role;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('farmerFields').classList.toggle('hidden',    role !== 'farmer');
    document.getElementById('volunteerFields').classList.toggle('hidden', role !== 'volunteer');
    document.getElementById('adminFields').classList.toggle('hidden',     role !== 'admin');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value;

    const body = {
        username: document.getElementById('username').value.trim(),
        email:    document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        role,
    };

    if (role === 'farmer') {
        body.name      = document.getElementById('name').value.trim();
        body.phone     = document.getElementById('phone').value.trim();
        body.location  = document.getElementById('location').value.trim();
        body.dunams    = document.getElementById('dunams').value;
        body.crop_type = document.getElementById('crop_type').value.trim();
    } else if (role === 'volunteer') {
        body.name       = document.getElementById('vol_name').value.trim();
        body.phone      = document.getElementById('vol_phone').value.trim();
        body.group_size = document.getElementById('group_size').value;
    }

    try {
        const res  = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();

        if (res.ok) {
            showMsg('msg', data.message, 'success');
            setTimeout(() => window.location.href = '/login', 1500);
        } else {
            showMsg('msg', data.error, 'error');
        }
    } catch (err) {
        showMsg('msg', 'שגיאה בשרת', 'error');
    }
});
