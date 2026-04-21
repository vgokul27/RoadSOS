const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * Predict accident severity based on speed and vehicle type
 * POST /api/ai/severity
 * Body: { speed, vehicleType }
 */
const predictSeverity = asyncHandler(async (req, res) => {
  const { speed, vehicleType } = req.body;

  // Validate input
  if (speed === undefined || !vehicleType) {
    return res.status(400).json({
      success: false,
      message: 'Speed and vehicleType are required',
    });
  }

  const validVehicleTypes = ['bike', 'car', 'truck', 'bus', 'auto'];
  if (!validVehicleTypes.includes(vehicleType)) {
    return res.status(400).json({
      success: false,
      message: `Invalid vehicleType. Must be one of: ${validVehicleTypes.join(', ')}`,
    });
  }

  if (typeof speed !== 'number' || speed < 0) {
    return res.status(400).json({
      success: false,
      message: 'Speed must be a positive number',
    });
  }

  let severity = 'Low';
  let confidence = 0.6;

  // Base severity calculation
  if (speed < 30) {
    severity = 'Low';
    confidence = 0.5 + (speed / 30) * 0.2;
  } else if (speed < 70) {
    severity = 'Medium';
    confidence = 0.65 + ((speed - 30) / 40) * 0.25;
  } else {
    severity = 'High';
    confidence = 0.8 + Math.min((speed - 70) / 50, 0.2);
  }

  // Adjust for vehicle type
  const vehicleMultipliers = {
    bike: 1.2, // Bikes are more vulnerable
    car: 1.0,
    truck: 1.5, // Trucks cause more damage
    bus: 1.4,
    auto: 1.1,
  };

  const multiplier = vehicleMultipliers[vehicleType];

  // Re-calculate severity with multiplier
  const adjustedSpeed = speed * multiplier;
  if (adjustedSpeed >= 70) {
    severity = 'High';
  } else if (adjustedSpeed >= 30) {
    severity = 'Medium';
  }

  // Clamp confidence between 0 and 1
  confidence = Math.min(confidence, 1);

  // Get recommendation based on severity
  const recommendations = {
    Low: 'Puncture repair service or towing',
    Medium: 'Ambulance and police assistance',
    High: 'Emergency trauma center with advanced ICU',
  };

  res.status(200).json({
    success: true,
    data: {
      severity,
      confidence: parseFloat(confidence.toFixed(2)),
      recommendation: recommendations[severity],
      baseSpeed: speed,
      vehicleType,
      riskMultiplier: multiplier,
    },
  });
});

/**
 * Analyze image for accident detection (placeholder)
 * POST /api/ai/analyze-image
 */
const analyzeImage = asyncHandler(async (req, res) => {
  const { imageUrl, speed, vehicleType } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image URL is required',
    });
  }

  // Simulate AI analysis
  const accidentDetected = Math.random() > 0.3; // 70% chance to detect
  const confidence = 0.5 + Math.random() * 0.5;

  // Get severity if accident detected
  let severity = 'Low';
  if (accidentDetected) {
    if (!speed || !vehicleType) {
      severity = 'Medium'; // Default
    } else {
      // Use speed/vehicle logic
      if (speed < 30) severity = 'Low';
      else if (speed < 70) severity = 'Medium';
      else severity = 'High';

      // Adjust for vehicle type
      if (vehicleType === 'truck' && severity !== 'High') {
        severity = severity === 'Low' ? 'Medium' : 'High';
      }
    }
  }

  const recommendations = {
    Low: 'Local repair service or traffic management',
    Medium: 'Ambulance and police unit dispatch',
    High: 'Emergency trauma center with full ICU support',
  };

  res.status(200).json({
    success: true,
    data: {
      accidentDetected,
      confidence: parseFloat(confidence.toFixed(2)),
      severity,
      recommendation: recommendations[severity],
      details: accidentDetected
        ? 'Accident detected in image. Emergency services recommended.'
        : 'No accident detected. Road appears clear.',
    },
  });
});

module.exports = {
  predictSeverity,
  analyzeImage,
};
