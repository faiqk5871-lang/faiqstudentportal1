document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const authSection = document.getElementById('authSection');
    const mainPortal = document.getElementById('mainPortal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');
    const applyModal = document.getElementById('applyModal');
    const userNameSpan = document.getElementById('userName');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const applyForm = document.getElementById('applyForm');

    let currentUser = null;
    const API_BASE = 'http://localhost:5000/api'; // Change for production

    // Tab switching
    window.showLogin = function() {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        event.target.classList.add('active');
        loginForm.classList.add('active');
    };

    window.showRegister = function() {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        event.target.classList.add('active');
        registerForm.classList.add('active');
    };

    // Register
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
            name: regName.value,
            email: regEmail.value,
            password: regPassword.value
        };

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            registerMessage.textContent = result.message;
            registerMessage.className = result.success ? 'message success' : 'message error';
            if (result.success) {
                setTimeout(() => showLogin(), 1500);
            }
        } catch (error) {
            registerMessage.textContent = 'Registration failed. Using demo mode.';
            registerMessage.className = 'message error';
        }
    });

    // Login (with demo fallback)
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
            email: loginEmail.value,
            password: loginPassword.value
        };

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (result.success) {
                currentUser = result.user;
                userNameSpan.textContent = `Welcome, ${currentUser.name}`;
                authSection.style.display = 'none';
                mainPortal.style.display = 'block';
            } else {
                loginMessage.textContent = result.message || 'Invalid credentials';
                loginMessage.className = 'message error';
            }
        } catch (error) {
            // Demo login fallback if backend not running
            console.log('Backend not available, using demo login');
            currentUser = { name: data.email.split('@')[0].charAt(0).toUpperCase() + data.email.split('@')[0].slice(1) };
            userNameSpan.textContent = `Welcome, ${currentUser.name}`;
            authSection.style.display = 'none';
            mainPortal.style.display = 'block';
        }
    });

    // Apply Modal
    window.openApplyModal = function(workshopId) {
        document.getElementById('selectedWorkshopId').value = workshopId;
        // Set workshop title based on ID
        const titles = {
            '1': 'Data Handling and Management',
            '2': 'UI/UX Design',
            '3': 'Web Development'
        };
        document.querySelector('#applyModal h2').textContent = `Apply for ${titles[workshopId] || 'Workshop'}`;
        applyModal.style.display = 'flex';
    };

    window.closeApplyModal = function() {
        applyModal.style.display = 'none';
        applyForm.reset();
        document.getElementById('imagePreview').innerHTML = '';
    };

    // Apply Form
    applyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('workshopId', document.getElementById('selectedWorkshopId').value);
        formData.append('workshopTitle', document.querySelector('#applyModal h2').textContent.replace('Apply for ', ''));
        formData.append('name', document.getElementById('applyName').value);
        formData.append('fatherName', document.getElementById('applyFatherName').value);
        formData.append('phone', document.getElementById('applyPhone').value);
        formData.append('email', document.getElementById('applyEmail').value);
        formData.append('class', document.getElementById('applyClass').value);
        formData.append('institute', document.getElementById('applyInstitute').value);
        formData.append('userId', currentUser ? currentUser.email : 'demo');
        const fileInput = document.getElementById('paymentScreenshot');
        if (fileInput.files[0]) {
            formData.append('paymentScreenshot', fileInput.files[0]);
        }

        try {
            const response = await fetch(`${API_BASE}/applications`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            alert(result.message || 'Application submitted!');
            closeApplyModal();
        } catch (error) {
            alert('Application submitted in demo mode (backend optional).');
            closeApplyModal();
        }
    });

    // Logout
    window.logout = function() {
        currentUser = null;
        authSection.style.display = 'block';
        mainPortal.style.display = 'none';
        loginForm.reset();
        registerForm.reset();
        loginMessage.textContent = '';
        registerMessage.textContent = '';
        // Reset login tab
        showLogin();
    };

    // Image preview
    document.getElementById('paymentScreenshot').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:200px;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Close modal on outside click
    window.onclick = function(event) {
        if (event.target === applyModal) {
            closeApplyModal();
        }
    };

// Notification upload functionality
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

    // Load notifications
    function loadNotifications() {
        const list = document.getElementById('announcementList');
        list.innerHTML = notifications.map(notif => `
            <div class="announcement-card">
                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    ${notif.image ? `<img src="${notif.image}" alt="${notif.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; flex-shrink: 0;">` : ''}
                    <div>
                        <h4>${notif.title}</h4>
                        <p>${notif.desc}</p>
                        <small style="color: var(--text-secondary);">Added by ${currentUser ? currentUser.name : 'Admin'}</small>
                    </div>
                </div>
            </div>
        `).join('') || '<p style="text-align: center; color: var(--text-secondary);">No announcements yet. Add one!</p>';
    }

    window.openNotificationModal = function() {
        document.getElementById('notificationModal').style.display = 'flex';
    };

    window.closeNotificationModal = function() {
        document.getElementById('notificationModal').style.display = 'none';
        document.getElementById('notificationForm').reset();
        document.getElementById('notifImagePreview').innerHTML = '';
    };

    // Notification form
    document.getElementById('notificationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', document.getElementById('notifTitle').value);
        formData.append('desc', document.getElementById('notifDesc').value);
        if (document.getElementById('notifImage').files[0]) {
            formData.append('image', document.getElementById('notifImage').files[0]);
        }
        formData.append('userId', currentUser ? currentUser.email : 'admin');

        try {
            const response = await fetch(`${API_BASE}/announcements`, {
                method: 'POST',
                body: formData
            });
            // Demo mode - store locally
            const notif = {
                id: Date.now(),
                title: formData.get('title'),
                desc: formData.get('desc'),
                image: document.getElementById('notifImage').files[0] ? URL.createObjectURL(document.getElementById('notifImage').files[0]) : null,
                userId: formData.get('userId'),
                date: new Date().toLocaleString()
            };
            notifications.unshift(notif);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            loadNotifications();
            closeNotificationModal();
            alert('Announcement published!');
        } catch (error) {
            // Demo local storage
            const notif = {
                id: Date.now(),
                title: document.getElementById('notifTitle').value,
                desc: document.getElementById('notifDesc').value,
                image: null,
                userId: currentUser ? currentUser.email : 'demo',
                date: new Date().toLocaleString()
            };
            notifications.unshift(notif);
            localStorage.setItem('notifications', JSON.stringify(notifications));
            loadNotifications();
            closeNotificationModal();
            alert('Announcement added (demo mode)');
        }
    });

    // Image preview for notification
    document.getElementById('notifImage').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('notifImagePreview').innerHTML = `<img src="${e.target.result}" style="max-width:200px;max-height:200px;border-radius: var(--radius);">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Load initial notifications after login
    loadNotifications();
});
