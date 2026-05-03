const express = require('express');
const multer = require('multer');
const path = require('path');
const { Announcement } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '../../backend/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('image'), auth, async (req, res) => {
  try {
    const announcementData = {
      title: req.body.title,
      desc: req.body.desc,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.user.email
    };

    const announcement = await Announcement.create(announcementData);
    res.json({ success: true, message: 'Announcement published!', id: announcement.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
