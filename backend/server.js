const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..'))); // Serve frontend files

// In-memory storage (no MongoDB required)
const users = [];
const applications = [];

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        res.json({ success: false, message: 'Email already exists' });
    } else {
        users.push({ name, email, password, createdAt: new Date() });
        res.json({ success: true, message: 'Registration successful!' });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ 
            success: true, 
            user: { name: user.name, email: user.email },
            token: 'demo-jwt-token'
        });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/applications', upload.single('paymentScreenshot'), (req, res) => {
    const applicationData = {
        workshopId: req.body.workshopId,
        workshopTitle: req.body.workshopTitle || 'Unknown Workshop',
        name: req.body.name,
        fatherName: req.body.fatherName,
        phone: req.body.phone,
        email: req.body.email,
        class: req.body.class,
        institute: req.body.institute,
        paymentScreenshot: req.file ? `/uploads/${req.file.filename}` : '',
        userId: req.body.userId || 'demo-user',
        status: 'Pending',
        createdAt: new Date()
    };

    applications.push(applicationData);
    res.json({ success: true, message: 'Application submitted successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});