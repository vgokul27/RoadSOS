const Incident = require('../models/Incident');
const Service = require('../models/Service');
const { calculateDistance } = require('../utils/distanceCalc');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * Create SOS alert
 * POST /api/sos
 * Body: { latitude, longitude, severity, vehicleType, speed, accidentDetected, confidence }
 */
const createSOS = asyncHandler(async (req, res) => {
  const {
    latitude,
    longitude,
    severity,
    vehicleType,
    speed,
    accidentDetected,
    confidence,
    description,
  } = req.body;

  // Validate required fields
  if (latitude === undefined || longitude === undefined || !severity) {
    return res.status(400).json({
      success: false,
      message: 'Latitude, longitude, and severity are required',
    });
  }

  // Validate severity
  if (!['Low', 'Medium', 'High'].includes(severity)) {
    return res.status(400).json({
      success: false,
      message: 'Severity must be Low, Medium, or High',
    });
  }

  // Create incident in database
  const incident = await Incident.create({
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    severity,
    vehicleType,
    speed: speed ? parseFloat(speed) : null,
    accidentDetected: accidentDetected || false,
    confidence: confidence ? parseFloat(confidence) : null,
    description,
    status: 'active',
  });

  // Find nearby services
  const allServices = await Service.find({ isActive: true });

  const nearbyServices = allServices
    .map((service) => ({
      serviceId: service._id,
      serviceName: service.name,
      type: service.type,
      contactNumber: service.contactNumber,
      latitude: service.latitude,
      longitude: service.longitude,
      distance: calculateDistance(
        latitude,
        longitude,
        service.latitude,
        service.longitude
      ),
      responseTime: service.responseTime,
      rating: service.rating,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Get top 5 nearest services

  // Update incident with assigned services
  incident.assignedServices = nearbyServices.map((s) => ({
    serviceId: s.serviceId,
    serviceName: s.serviceName,
    distance: s.distance,
  }));
  await incident.save();

  // Determine which services to alert based on severity
  let servicesToAlert = [];

  if (severity === 'High') {
    // Alert hospitals, police, and ambulances
    servicesToAlert = nearbyServices.filter((s) =>
      ['hospital', 'ambulance', 'police'].includes(s.type)
    );
  } else if (severity === 'Medium') {
    // Alert ambulances and police
    servicesToAlert = nearbyServices.filter((s) =>
      ['ambulance', 'police'].includes(s.type)
    );
  } else {
    // Low severity: alert towing/puncture services
    servicesToAlert = nearbyServices.filter((s) =>
      ['towing', 'puncture'].includes(s.type)
    );
  }

  // If not enough typing-specific services, add closest ones
  if (servicesToAlert.length < 3) {
    servicesToAlert = nearbyServices.slice(0, 3);
  }

  // Simulate sending alerts to services
  const alertResults = servicesToAlert.map((service) => ({
    serviceName: service.serviceName,
    type: service.type,
    contactNumber: service.contactNumber,
    distance: service.distance,
    estimatedArrival: `${Math.ceil(service.responseTime + service.distance / 20)} minutes`,
    status: 'Alert Sent',
  }));

  res.status(201).json({
    success: true,
    message: 'SOS Alert Created & Sent Successfully',
    data: {
      incidentId: incident._id,
      location: {
        latitude: incident.latitude,
        longitude: incident.longitude,
      },
      severity: incident.severity,
      createdAt: incident.createdAt,
      alertsSent: alertResults,
      nearbyServices: nearbyServices.slice(0, 5),
    },
  });
});

/**
 * Get SOS incident details
 * GET /api/sos/:incidentId
 */
const getSOSDetails = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;

  const incident = await Incident.findById(incidentId);

  if (!incident) {
    return res.status(404).json({
      success: false,
      message: 'Incident not found',
    });
  }

  res.status(200).json({
    success: true,
    data: incident,
  });
});

/**
 * Update incident status
 * PATCH /api/sos/:incidentId/status
 */
const updateIncidentStatus = asyncHandler(async (req, res) => {
  const { incidentId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['active', 'responded', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const updateData = { status };
  if (notes) updateData.notes = notes;
  if (status === 'resolved') updateData.resolvedAt = new Date();

  const incident = await Incident.findByIdAndUpdate(incidentId, updateData, {
    new: true,
  });

  if (!incident) {
    return res.status(404).json({
      success: false,
      message: 'Incident not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Incident status updated',
    data: incident,
  });
});

/**
 * Get recent SOS incidents
 * GET /api/sos/recent?limit=10
 */
const getRecentSOS = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const status = req.query.status;

  const query = {};
  if (status) query.status = status;

  const incidents = await Incident.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({
    success: true,
    count: incidents.length,
    data: incidents,
  });
});

module.exports = {
  createSOS,
  getSOSDetails,
  updateIncidentStatus,
  getRecentSOS,
};
