const express = require('express');
const router = express.Router();
const {
  getNearbyServices,
  getServicesByType,
  getStats,
  createService,
} = require('../controllers/emergencyController');

// Get nearby emergency services
router.get('/nearby', getNearbyServices);

// Get services by type
router.get('/by-type/:type', getServicesByType);

// Get dashboard statistics
router.get('/stats', getStats);

// Create a new service (for demo/testing)
router.post('/service', createService);

module.exports = router;
