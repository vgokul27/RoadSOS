// Vehicle type definitions
export const vehicleTypes = [
  { value: 'bike', label: '🏍️ Bike' },
  { value: 'car', label: '🚗 Car' },
  { value: 'truck', label: '🚚 Truck' },
  { value: 'bus', label: '🚌 Bus' },
  { value: 'auto', label: '🛵 Auto' },
];

// Demo scenarios for quick testing
export const demoScenarios = [
  {
    label: 'Highway Pile-up',
    description: 'High-speed truck collision on highway',
    speed: 120,
    vehicle: 'truck',
  },
  {
    label: 'City Fender Bender',
    description: 'Low-speed parking lot incident',
    speed: 25,
    vehicle: 'car',
  },
  {
    label: 'Bike Accident',
    description: 'Moderate speed motorcycle incident',
    speed: 60,
    vehicle: 'bike',
  },
];

// Sample images for demo
export const sampleImages = [
  {
    label: 'Minor Fender Bender',
    url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
  },
  {
    label: 'Highway Collision',
    url: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400&h=300&fit=crop',
  },
  {
    label: 'Multi-Vehicle Accident',
    url: 'https://images.unsplash.com/photo-1562183692-e70300c70fe5?w=400&h=300&fit=crop',
  },
];

// Calculate severity based on speed and vehicle type
const calculateSeverity = (speed, vehicleType) => {
  let severity = 'Low';
  if (speed >= 30 && speed < 70) severity = 'Medium';
  if (speed >= 70) severity = 'High';

  // Increase severity for trucks
  if (vehicleType === 'truck') {
    if (severity === 'Low') severity = 'Medium';
    if (severity === 'Medium') severity = 'High';
  }

  return severity;
};

// Get recommendation based on severity
const getRecommendation = (severity) => {
  if (severity === 'Low') {
    return '⚠️ Minor collision detected. Visit nearby clinic or repair shop for assessment.';
  } else if (severity === 'Medium') {
    return '⚠️ Moderate accident detected. Proceed to nearest hospital for medical evaluation.';
  } else {
    return '🚨 Severe accident detected. Call emergency services or go to nearest trauma center immediately.';
  }
};

// Simulate AI image analysis
export const analyzeImage = async (imageUrl, inputs) => {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Random confidence for realism
  const confidence = Math.random() * 0.25 + 0.75; // 75-100%
  
  // Simple detection logic based on image characteristics
  // In real app, this would call backend ML model
  const accidentDetected = Math.random() > 0.4; // 60% chance of accident

  const severity = calculateSeverity(inputs.speed, inputs.vehicleType);
  const recommendation = getRecommendation(severity);

  return {
    accidentDetected,
    severity,
    confidence,
    recommendation,
    details: accidentDetected
      ? `Accident detected with ${confidence.toFixed(2)} confidence. Speed: ${inputs.speed} km/h, Vehicle: ${inputs.vehicleType}`
      : `No accident detected. Image analysis completed with ${confidence.toFixed(2)} confidence.`,
  };
};
