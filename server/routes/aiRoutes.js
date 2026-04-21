const express = require('express');
const router = express.Router();
const { predictSeverity, analyzeImage } = require('../controllers/aiController');

// Predict severity based on speed and vehicle type
router.post('/severity', predictSeverity);

// Analyze image for accident detection
router.post('/analyze-image', analyzeImage);

module.exports = router;
