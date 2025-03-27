import express from 'express';
import { sampleIssues } from '../data/sampleIssues.js';

const router = express.Router();

// Get all issues
router.get('/', (req, res) => {
  res.json(sampleIssues);
});

// Search issues
router.get('/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.json(sampleIssues);
  }

  const searchResults = sampleIssues.filter(issue => 
    issue.title.toLowerCase().includes(query.toLowerCase()) ||
    issue.description.toLowerCase().includes(query.toLowerCase()) ||
    issue.category.toLowerCase().includes(query.toLowerCase())
  );

  res.json(searchResults);
});

// Create new issue
router.post('/', (req, res) => {
  const newIssue = {
    _id: String(sampleIssues.length + 1),
    ...req.body,
    createdAt: new Date().toISOString(),
    status: 'open',
    votes: 0,
  };
  sampleIssues.unshift(newIssue);
  res.status(201).json(newIssue);
});

// Update issue
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = sampleIssues.findIndex(issue => issue._id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  sampleIssues[index] = { ...sampleIssues[index], ...req.body };
  res.json(sampleIssues[index]);
});

// Delete issue
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = sampleIssues.findIndex(issue => issue._id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Issue not found' });
  }

  sampleIssues.splice(index, 1);
  res.status(204).send();
});

export default router; 