const Service = require('../models/Service');
const Incident = require('../models/Incident');
const { calculateDistance } = require('../utils/distanceCalc');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * Get nearby emergency services
 * GET /api/emergency/nearby
 * Query: lat, lng, radius (optional), limit (optional)
 */
const getNearbyServices = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  // Validate input
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required',
    });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const radius = req.query.radius ? parseFloat(req.query.radius) : 50; // km
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  // Validate coordinates
  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid latitude or longitude',
    });
  }

  // Fetch all services (in production, use geospatial queries)
  const services = await Service.find({ isActive: true });

  // Calculate distances and filter by radius
  const nearbyServices = services
    .map((service) => ({
      _id: service._id,
      name: service.name,
      type: service.type,
      latitude: service.latitude,
      longitude: service.longitude,
      address: service.address,
      contactNumber: service.contactNumber,
      email: service.email,
      isVerified: service.isVerified,
      responseTime: service.responseTime,
      rating: service.rating,
      distance: calculateDistance(
        userLat,
        userLng,
        service.latitude,
        service.longitude
      ),
    }))
    .filter((service) => service.distance <= radius)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  res.status(200).json({
    success: true,
    count: nearbyServices.length,
    data: nearbyServices,
  });
});

/**
 * Get emergency services by type
 * GET /api/emergency/by-type/:type
 */
const getServicesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { lat, lng } = req.query;

  const validTypes = ['hospital', 'police', 'ambulance', 'towing', 'puncture'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid service type',
    });
  }

  const services = await Service.find({
    type,
    isActive: true,
  });

  // Calculate distances if location provided
  if (lat && lng) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const servicesWithDistance = services.map((service) => ({
      ...service.toObject(),
      distance: calculateDistance(
        userLat,
        userLng,
        service.latitude,
        service.longitude
      ),
    }));

    servicesWithDistance.sort((a, b) => a.distance - b.distance);
    return res.status(200).json({
      success: true,
      count: servicesWithDistance.length,
      data: servicesWithDistance,
    });
  }

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

/**
 * Get dashboard statistics
 * GET /api/emergency/stats
 */
const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Total incidents
  const totalIncidents = await Incident.countDocuments();

  // Active incidents
  const activeIncidents = await Incident.countDocuments({
    status: { $in: ['active', 'responded'] },
  });

  // Incidents by severity
  const severityDistribution = await Incident.aggregate([
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 },
      },
    },
  ]);

  // Weekly incidents (last 7 days)
  const weeklyIncidents = await Incident.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfWeek },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Recent incidents (last 10)
  const recentIncidents = await Incident.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('latitude longitude severity status createdAt vehicleType');

  // Average response time from incidents with assigned services
  const avgResponseTime =
    await Incident.aggregate([
      {
        $match: {
          'assignedServices.0': { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          average: {
            $avg: {
              $arrayElemAt: [
                '$assignedServices.distance',
                0,
              ],
            },
          },
        },
      },
    ]);

  // AI detections count
  const aiDetections = await Incident.countDocuments({
    accidentDetected: true,
  });

  res.status(200).json({
    success: true,
    data: {
      totalIncidents,
      activeIncidents,
      aiDetections,
      severityDistribution: severityDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      weeklyIncidents,
      recentIncidents,
      averageResponseDistance:
        avgResponseTime.length > 0
          ? parseFloat(avgResponseTime[0].average.toFixed(2))
          : 0,
    },
  });
});

/**
 * Create a new service (for demo purposes)
 * POST /api/emergency/service
 */
const createService = asyncHandler(async (req, res) => {
  const { name, type, latitude, longitude, address, contactNumber, email } =
    req.body;

  if (
    !name ||
    !type ||
    latitude === undefined ||
    longitude === undefined ||
    !contactNumber
  ) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const service = await Service.create({
    name,
    type,
    latitude,
    longitude,
    address,
    contactNumber,
    email,
    isVerified: true,
  });

  res.status(201).json({
    success: true,
    data: service,
  });
});

module.exports = {
  getNearbyServices,
  getServicesByType,
  getStats,
  createService,
};
