// Sample data (replace with API calls)
const sampleAnnouncements = [
    {
        id: 1,
        title: "New Semester Registration Open!",
        date: "2024-01-15",
        image: "📢"
    },
    {
        id: 2,
        title: "Winter Workshop Series Announced",
        date: "2024-01-12",
        image: "❄️"
    }
];

const sampleWorkshops = [
    {
        id: 1,
        title: "Data Handling and Management",
        date: "Coming Soon",
        fees: "Rs4000",
        image: "🐍"
    },
    {
        id: 2,
        title: "Basic Course",
        date: "Coming Soon",
        fees: "Rs2000",
        image: "🌐"
    }
];

let currentUser = null;

// Auth Section Functions
function showLogin(event) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        document.querySelector('.tab:first-child').classList.add('active');
    }
    document.getElementById('loginForm').classList.add('active');
}

function showRegister(event) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        document.querySelector('.tab:last-child').classList.add('active');
    }
    document.getElementById('registerForm').classList.add('active');
}

// Login Form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Replace with your backend API
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            currentUser = data.user;
            showPortal();
        } else {
            showMessage('loginMessage', data.message, 'error');
        }
    } catch (error) {
        // Demo mode - use sample login
        currentUser = { name: email.split('@')[0], email };
        document.getElementById('userName').textContent = `Welcome, ${currentUser.name}`;
        showPortal();
    }
});

// Register Form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        // Replace with your backend API
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        showMessage('registerMessage', data.message, data.success ? 'success' : 'error');
    } catch (error) {
        showMessage('registerMessage', 'Demo registration successful!', 'success');
        setTimeout(() => showLogin(), 1500);
    }
});

function showPortal() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('mainPortal').style.display = 'block';
    loadAnnouncements();
    loadWorkshops();
}

function logout() {
    currentUser = null;
    document.getElementById('mainPortal').style.display = 'none';
    document.getElementById('authSection').style.display = 'flex';
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

function showMessage(id, message, type) {
    const element = document.getElementById(id);
    element.textContent = message;
    element.className = `message ${type}`;
}

function loadAnnouncements() {
    const container = document.getElementById('announcementList');
    container.innerHTML = sampleAnnouncements.map(ann => `
        <div class="announcement-item">
            <h3>${ann.title}</h3>
            <p><strong>Date:</strong> ${ann.date}</p>
            <div style="font-size: 48px; margin-top: 15px;">${ann.image}</div>
        </div>
    `).join('');
}

function loadWorkshops() {
    const container = document.getElementById('workshopsGrid');
    container.innerHTML = sampleWorkshops.map(workshop => `
        <div class="workshop-card">
            <div class="workshop-image">
                <span style="font-size: 48px;">${workshop.image}</span>
            </div>
            <div class="workshop-content">
                <h3 class="workshop-title">${workshop.title}</h3>
                <div class="workshop-date">📅 Launch Date: ${workshop.date}</div>
                <div class="workshop-fees">${workshop.fees}</div>
                <button class="btn-apply" onclick="openApplyModal(${workshop.id}, '${workshop.title}')">
                    Apply Now
                </button>
            </div>
        </div>
    `).join('');
}

function openApplyModal(workshopId, workshopTitle) {
    document.getElementById('selectedWorkshopId').value = workshopId;
    document.querySelector('#applyModal h2').textContent = `Apply for ${workshopTitle}`;
    document.getElementById('applyModal').style.display = 'block';
    document.getElementById('applyName').value = currentUser?.name || '';
    document.getElementById('applyEmail').value = currentUser?.email || '';
}

function closeApplyModal() {
    document.getElementById('applyModal').style.display = 'none';
    document.getElementById('applyForm').reset();
}

// Apply Form Submission
document.getElementById('applyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('workshopId', document.getElementById('selectedWorkshopId').value);
    formData.append('name', document.getElementById('applyName').value);
    formData.append('fatherName', document.getElementById('applyFatherName').value);
    formData.append('phone', document.getElementById('applyPhone').value);
    formData.append('email', document.getElementById('applyEmail').value);
    formData.append('class', document.getElementById('applyClass').value);
    formData.append('institute', document.getElementById('applyInstitute').value);
    formData.append('paymentScreenshot', document.getElementById('paymentScreenshot').files[0]);

    try {
        // Replace with your backend API
        const response = await fetch('/api/applications', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Application submitted successfully!');
            closeApplyModal();
        } else {
            alert('Error submitting application: ' + data.message);
        }
    } catch (error) {
        alert('Demo: Application submitted successfully!');
        closeApplyModal();
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('applyModal');
    if (event.target == modal) {
        closeApplyModal();
    }
}