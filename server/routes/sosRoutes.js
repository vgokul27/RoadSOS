const express = require('express');
const router = express.Router();
const {
  createSOS,
  getSOSDetails,
  updateIncidentStatus,
  getRecentSOS,
} = require('../controllers/sosController');

// Create SOS alert
router.post('/', createSOS);

// Get specific SOS/incident details
router.get('/:incidentId', getSOSDetails);

// Update incident status
router.patch('/:incidentId/status', updateIncidentStatus);

// Get recent SOS incidents
router.get('/', getRecentSOS);

module.exports = router;
