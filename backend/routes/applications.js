const express = require('express');
const multer = require('multer');
const path = require('path');
const { Application } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '../../backend/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('paymentScreenshot'), auth, async (req, res) => {
  try {
    const applicationData = {
      workshopId: req.body.workshopId,
      workshopTitle: req.body.workshopTitle,
      name: req.body.name,
      fatherName: req.body.fatherName,
      phone: req.body.phone,
      email: req.body.email,
      class: req.body.class,
      institute: req.body.institute,
      paymentScreenshot: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.email,
      status: 'Pending'
    };

    const application = await Application.create(applicationData);
    res.json({ success: true, message: 'Application submitted successfully!', id: application.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during application submission' });
  }
});

module.exports = router;
