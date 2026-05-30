function selectRole(role) {
    document.getElementById('role').value = role;

    // עדכון כפתורים
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // הצגת שדות מתאימים
    document.getElementById('farmerFields').classList.toggle('hidden',    role !== 'farmer');
    document.getElementById('volunteerFields').classList.toggle('hidden', role !== 'volunteer');
    document.getElementById('orgFields').classList.toggle('hidden',       role !== 'organization');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const role = document.getElementById('role').value;
    const body = {
        username: document.getElementById('username').value,
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value,
        role,
        name:     document.getElementById('name').value,
        phone:    document.getElementById('phone').value,
    };

    if (role === 'farmer') {
        body.location  = document.getElementById('location').value;
        body.dunams    = document.getElementById('dunams').value;
        body.crop_type = document.getElementById('crop_type').value;
    } else if (role === 'volunteer') {
        body.group_size = document.getElementById('group_size').value;
    } else if (role === 'organization') {
        body.address = document.getElementById('address').value;
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
