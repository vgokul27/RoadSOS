require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Incident = require('../models/Incident');

// Sample services data
const sampleServices = [
  // Hospitals
  {
    name: 'City General Hospital',
    type: 'hospital',
    latitude: 28.6139,
    longitude: 77.209,
    address: 'Delhi, India',
    contactNumber: '+91-11-4141-1414',
    email: 'info@cityhospital.com',
    responseTime: 8,
    rating: 4.8,
    isVerified: true,
  },
  {
    name: 'Max Healthcare',
    type: 'hospital',
    latitude: 28.5355,
    longitude: 77.391,
    address: 'Noida, India',
    contactNumber: '+91-120-4141-1414',
    email: 'emergency@maxhealthcare.com',
    responseTime: 10,
    rating: 4.7,
    isVerified: true,
  },
  {
    name: 'Apollo Hospital',
    type: 'hospital',
    latitude: 28.4595,
    longitude: 77.0266,
    address: 'Gurugram, India',
    contactNumber: '+91-124-4141-1414',
    email: 'emergency@apollogurugrram.com',
    responseTime: 12,
    rating: 4.9,
    isVerified: true,
  },
  // Police Stations
  {
    name: 'Central Police Station',
    type: 'police',
    latitude: 28.6262,
    longitude: 77.2197,
    address: 'New Delhi, India',
    contactNumber: '+91-11-2371-4243',
    email: 'central@delhipolice.gov.in',
    responseTime: 5,
    rating: 4.3,
    isVerified: true,
  },
  {
    name: 'Traffic Police Unit - East',
    type: 'police',
    latitude: 28.5921,
    longitude: 77.2975,
    address: 'Delhi East, India',
    contactNumber: '+91-11-4141-2010',
    email: 'traffic@delhipolice.gov.in',
    responseTime: 4,
    rating: 4.2,
    isVerified: true,
  },
  {
    name: 'Highway Patrol Unit',
    type: 'police',
    latitude: 28.4089,
    longitude: 77.0266,
    address: 'Delhi-Gurugram Highway',
    contactNumber: '+91-11-9999-9999',
    email: 'highway@delhipolice.gov.in',
    responseTime: 3,
    rating: 4.5,
    isVerified: true,
  },
  // Ambulance Services
  {
    name: 'Emergency Ambulance Service - 1',
    type: 'ambulance',
    latitude: 28.6305,
    longitude: 77.2197,
    address: 'New Delhi Medical Hub',
    contactNumber: '+91-108',
    email: 'emergency@ambulance1.com',
    responseTime: 6,
    rating: 4.6,
    isVerified: true,
  },
  {
    name: 'Fast Response Ambulance',
    type: 'ambulance',
    latitude: 28.5494,
    longitude: 77.3912,
    address: 'Noida Up',
    contactNumber: '+91-120-333-8888',
    email: 'contact@fastambulance.com',
    responseTime: 5,
    rating: 4.7,
    isVerified: true,
  },
  {
    name: 'LifeLink Ambulance Service',
    type: 'ambulance',
    latitude: 28.4089,
    longitude: 77.2633,
    address: 'South Delhi',
    contactNumber: '+91-11-2222-2222',
    email: 'service@lifelink.com',
    responseTime: 7,
    rating: 4.4,
    isVerified: true,
  },
  // Towing Services
  {
    name: 'QuickTow Services',
    type: 'towing',
    latitude: 28.6139,
    longitude: 77.209,
    address: 'Central Towing Hub',
    contactNumber: '+91-11-8888-8888',
    email: 'quicktow@towing.com',
    responseTime: 10,
    rating: 4.5,
    isVerified: true,
  },
  {
    name: 'Express Towing & Recovery',
    type: 'towing',
    latitude: 28.5355,
    longitude: 77.391,
    address: 'Noida Towing Center',
    contactNumber: '+91-120-7777-7777',
    email: 'express@towing.com',
    responseTime: 12,
    rating: 4.3,
    isVerified: true,
  },
  // Puncture Repair
  {
    name: 'Tire Doctors Roadside Repair',
    type: 'puncture',
    latitude: 28.5921,
    longitude: 77.2975,
    address: 'Delhi Bypass',
    contactNumber: '+91-11-6666-6666',
    email: 'repair@tiredoctors.com',
    responseTime: 8,
    rating: 4.4,
    isVerified: true,
  },
  {
    name: 'RoadsideCareCare',
    type: 'puncture',
    latitude: 28.4595,
    longitude: 77.0266,
    address: 'Gurugram Sector 14',
    contactNumber: '+91-124-5555-5555',
    email: 'care@roadsidecare.com',
    responseTime: 9,
    rating: 4.6,
    isVerified: true,
  },
];

// Sample incidents data
const sampleIncidents = [
  {
    latitude: 28.6139,
    longitude: 77.209,
    severity: 'High',
    status: 'resolved',
    vehicleType: 'truck',
    speed: 85,
    accidentDetected: true,
    confidence: 0.95,
    description: 'Heavy truck collision on main highway',
    assignedServices: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    latitude: 28.5355,
    longitude: 77.391,
    severity: 'Medium',
    status: 'resolved',
    vehicleType: 'car',
    speed: 45,
    accidentDetected: true,
    confidence: 0.88,
    description: 'Minor rear-end collision',
    assignedServices: [],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    latitude: 28.4595,
    longitude: 77.0266,
    severity: 'Low',
    status: 'resolved',
    vehicleType: 'bike',
    speed: 25,
    accidentDetected: false,
    confidence: 0.42,
    description: 'Single vehicle accident',
    assignedServices: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    latitude: 28.6262,
    longitude: 77.2197,
    severity: 'High',
    status: 'responded',
    vehicleType: 'bus',
    speed: 55,
    accidentDetected: true,
    confidence: 0.92,
    description: 'Multi-vehicle pile-up on city road',
    assignedServices: [],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    latitude: 28.5921,
    longitude: 77.2975,
    severity: 'Medium',
    status: 'active',
    vehicleType: 'car',
    speed: 65,
    accidentDetected: true,
    confidence: 0.85,
    description: 'Collision with traffic light pole',
    assignedServices: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Incident.deleteMany({});
    console.log('✨ Cleared existing data');

    // Insert sample services
    const services = await Service.insertMany(sampleServices);
    console.log(`✅ Created ${services.length} sample services`);

    // Insert sample incidents
    const incidents = await Incident.insertMany(sampleIncidents);
    console.log(`✅ Created ${incidents.length} sample incidents`);

    // Assign services to incidents
    for (let i = 0; i < incidents.length; i++) {
      const randomServices = services
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      incidents[i].assignedServices = randomServices.map((s) => ({
        serviceId: s._id,
        serviceName: s.name,
        distance: Math.random() * 10 + 1,
      }));
      await incidents[i].save();
    }
    console.log('✅ Assigned services to incidents');

    console.log(`
╔═════════════════════════════════════════╗
║   Database Seeding Complete!            ║
║                                         ║
║   Services Created: ${services.length}
║   Incidents Created: ${incidents.length}
║   Sample Data Ready for Testing         ║
╚═════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
