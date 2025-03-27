const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Issue = require('../models/Issue');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Get all issues with filters
router.get('/', async (req, res) => {
  try {
    const { category, severity, status, lat, lng, radius } = req.query;
    let query = {};

    // Apply filters
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    // Apply location filter if coordinates and radius are provided
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      };
    }

    const issues = await Issue.find(query)
      .populate('reportedBy', 'name email')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issues', error: error.message });
  }
});

// Get single issue
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email')
      .populate('resolvedBy', 'name email')
      .populate('comments.user', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching issue', error: error.message });
  }
});

// Create new issue (protected route)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, severity, location } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const issue = new Issue({
      title,
      description,
      category,
      severity,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      images,
      reportedBy: req.user.userId
    });

    await issue.save();

    // Add issue to user's reported issues
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { issuesReported: issue._id }
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error creating issue', error: error.message });
  }
});

// Update issue status (protected route)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = status;
    if (status === 'Resolved') {
      issue.resolvedBy = req.user.userId;
      issue.resolvedAt = Date.now();

      // Add points to resolver
      await User.findByIdAndUpdate(req.user.userId, {
        $inc: { points: 10 },
        $push: { issuesResolved: issue._id }
      });
    }

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error updating issue status', error: error.message });
  }
});

// Add comment to issue (protected route)
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.comments.push({
      text,
      user: req.user.userId
    });

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
});

// Delete issue (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Only allow deletion by the reporter or admin
    if (issue.reportedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await issue.remove();
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting issue', error: error.message });
  }
});

module.exports = router;