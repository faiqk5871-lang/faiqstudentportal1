const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve frontend files
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentportal', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schemas
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const applicationSchema = new mongoose.Schema({
    workshopId: String,
    workshopTitle: String,
    name: String,
    fatherName: String,
    phone: String,
    email: String,
    class: String,
    institute: String,
    paymentScreenshot: String,
    userId: String,
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Application = mongoose.model('Application', applicationSchema);

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        res.json({ success: false, message: 'Email already exists' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.json({ 
                success: true, 
                user: { name: user.name, email: user.email },
                token: 'demo-jwt-token'
            });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.json({ success: false, message: 'Login failed' });
    }
});

app.post('/api/applications', upload.single('paymentScreenshot'), async (req, res) => {
    try {
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
            userId: req.body.userId || 'demo-user'
        };

        const application = new Application(applicationData);
        await application.save();
        
        res.json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        res.json({ success: false, message: 'Failed to submit application' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});