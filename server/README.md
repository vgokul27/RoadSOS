# RoadSOS Backend 🚨

Backend for the **RoadSOS - AI Emergency Response System**, a comprehensive emergency management and accident detection platform.

## 🏗️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Environment**: dotenv
- **CORS**: Enabled for frontend communication

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── models/
│   ├── Service.js            # Emergency service model (hospitals, police, etc.)
│   └── Incident.js           # Accident incident model
├── controllers/
│   ├── emergencyController.js # Emergency services logic
│   ├── aiController.js        # AI prediction logic
│   └── sosController.js       # SOS alert handling
├── routes/
│   ├── emergencyRoutes.js    # Emergency service routes
│   ├── aiRoutes.js           # AI prediction routes
│   └── sosRoutes.js          # SOS alert routes
├── middleware/
│   └── errorMiddleware.js    # Error handling & async wrapper
├── utils/
│   └── distanceCalc.js       # Haversine distance calculation
├── scripts/
│   └── seed.js               # Database seeding with sample data
├── app.js                    # Express app configuration
├── server.js                 # Server startup
├── package.json              # Dependencies
└── .env.example              # Environment variables template
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 2. Installation

```bash
cd server
npm install
```

### 3. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB URI:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/roadsos
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Seeding

Populate the database with sample services and incidents:

```bash
npm run seed
```

This creates:
- 12 emergency services (hospitals, police, ambulances, towing, puncture repair)
- 5 sample incidents with various severity levels

### 5. Start Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Verify server is running

---

## 🚑 Emergency Services API

### Get Nearby Services
```
GET /api/emergency/nearby?lat=28.6139&lng=77.209&radius=50&limit=10
```

**Query Parameters:**
- `lat` (required) - User latitude
- `lng` (required) - User longitude
- `radius` (optional) - Search radius in km (default: 50)
- `limit` (optional) - Number of results (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "City General Hospital",
      "type": "hospital",
      "latitude": 28.6139,
      "longitude": 77.209,
      "distance": 0.5,
      "contactNumber": "+91-11-4141-1414",
      "isVerified": true,
      "responseTime": 8,
      "rating": 4.8
    }
  ]
}
```

### Get Services by Type
```
GET /api/emergency/by-type/:type?lat=28.6139&lng=77.209
```

**Types**: `hospital`, `police`, `ambulance`, `towing`, `puncture`

### Get Dashboard Statistics
```
GET /api/emergency/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncidents": 127,
    "activeIncidents": 3,
    "aiDetections": 89,
    "severityDistribution": {
      "Low": 45,
      "Medium": 52,
      "High": 30
    },
    "weeklyIncidents": [
      { "_id": "2024-01-01", "count": 12 },
      ...
    ],
    "recentIncidents": [...],
    "averageResponseDistance": 4.2
  }
}
```

### Create Emergency Service (Demo)
```
POST /api/emergency/service
```

**Body:**
```json
{
  "name": "Test Hospital",
  "type": "hospital",
  "latitude": 28.6139,
  "longitude": 77.209,
  "address": "Address",
  "contactNumber": "+91-...",
  "email": "test@hospital.com"
}
```

---

## 🤖 AI Prediction API

### Predict Accident Severity
```
POST /api/ai/severity
```

**Body:**
```json
{
  "speed": 75,
  "vehicleType": "truck"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "severity": "High",
    "confidence": 0.92,
    "recommendation": "Emergency trauma center with advanced ICU",
    "baseSpeed": 75,
    "vehicleType": "truck",
    "riskMultiplier": 1.5
  }
}
```

**Severity Logic:**
- Speed < 30 km/h → **Low**
- Speed 30-70 km/h → **Medium**
- Speed > 70 km/h → **High**

**Vehicle Multipliers:**
- Bike: 1.2× (more vulnerable)
- Car: 1.0×
- Truck: 1.5× (causes more damage)
- Bus: 1.4×
- Auto: 1.1×

### Analyze Image
```
POST /api/ai/analyze-image
```

**Body:**
```json
{
  "imageUrl": "https://...",
  "speed": 45,
  "vehicleType": "car"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accidentDetected": true,
    "confidence": 0.87,
    "severity": "Medium",
    "recommendation": "Ambulance and police assistance",
    "details": "Accident detected in image. Emergency services recommended."
  }
}
```

---

## 🚨 SOS Alert API

### Create SOS Alert
```
POST /api/sos
```

**Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.209,
  "severity": "High",
  "vehicleType": "truck",
  "speed": 85,
  "accidentDetected": true,
  "confidence": 0.92,
  "description": "Heavy accident on highway"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SOS Alert Created & Sent Successfully",
  "data": {
    "incidentId": "...",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.209
    },
    "severity": "High",
    "alertsSent": [
      {
        "serviceName": "City General Hospital",
        "type": "hospital",
        "contactNumber": "+91-11-4141-1414",
        "distance": 0.5,
        "estimatedArrival": "12 minutes",
        "status": "Alert Sent"
      }
    ]
  }
}
```

### Get Recent SOS Incidents
```
GET /api/sos?limit=10&status=active
```

### Get Incident Details
```
GET /api/sos/:incidentId
```

### Update Incident Status
```
PATCH /api/sos/:incidentId/status
```

**Body:**
```json
{
  "status": "resolved",
  "notes": "Successfully handled and resolved"
}
```

**Status Values**: `active`, `responded`, `resolved`

---

## 🗄️ MongoDB Models

### Service Model
```javascript
{
  name: String,              // Service name
  type: String,              // hospital, police, ambulance, towing, puncture
  latitude: Number,          // Geo location
  longitude: Number,         // Geo location
  address: String,           // Physical address
  contactNumber: String,     // Contact phone
  email: String,             // Contact email
  isVerified: Boolean,       // Verification status
  responseTime: Number,      // Avg response time in minutes
  rating: Number,            // Service rating (0-5)
  isActive: Boolean,         // Operational status
  timestamps: true           // createdAt, updatedAt
}
```

### Incident Model
```javascript
{
  latitude: Number,          // Accident location
  longitude: Number,         // Accident location
  severity: String,          // Low, Medium, High
  status: String,            // active, responded, resolved
  description: String,       // Incident details
  vehicleType: String,       // bike, car, truck, bus, auto
  speed: Number,             // Speed at accident (km/h)
  accidentDetected: Boolean, // AI detection flag
  confidence: Number,        // Detection confidence (0-1)
  assignedServices: Array,   // Assigned emergency services
  resolvedAt: Date,          // Resolution timestamp
  notes: String,             // Additional notes
  timestamps: true           // createdAt, updatedAt
}
```

---

## ⚙️ Error Handling

All errors return standard error response:

```json
{
  "success": false,
  "message": "Error description",
  "error": { ... } // Only in development
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

---

## 🧪 Testing with cURL

```bash
# Check server health
curl http://localhost:5000/api/health

# Get nearby services
curl "http://localhost:5000/api/emergency/nearby?lat=28.6139&lng=77.209"

# Predict severity
curl -X POST http://localhost:5000/api/ai/severity \
  -H "Content-Type: application/json" \
  -d '{"speed": 75, "vehicleType": "truck"}'

# Create SOS alert
curl -X POST http://localhost:5000/api/sos \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.6139,
    "longitude": 77.209,
    "severity": "High",
    "vehicleType": "truck",
    "speed": 85,
    "accidentDetected": true,
    "confidence": 0.92
  }'

# Get dashboard stats
curl http://localhost:5000/api/emergency/stats
```

---

## 📊 Sample Database

The seeder creates realistic demo data:

**Services:**
- 3 Hospitals (with different ratings & response times)
- 3 Police Stations
- 3 Ambulance Services
- 2 Towing Services
- 2 Puncture Repair Services

**Incidents:**
- High severity (multiple vehicles, highways)
- Medium severity (minor collisions)
- Low severity (single vehicle, small damage)
- Various statuses (active, responded, resolved)

---

## 🔐 Environment Variables

```env
# Server
PORT=5000                              # Server port
NODE_ENV=development                   # development or production

# Database
MONGO_URI=mongodb://localhost:27017/roadsos  # MongoDB connection

# CORS
CORS_ORIGIN=http://localhost:3000     # Frontend URL
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure real MongoDB Atlas instance
- [ ] Update `CORS_ORIGIN` to production frontend URL
- [ ] Add authentication (JWT)
- [ ] Set up logging service
- [ ] Enable input validation
- [ ] Set rate limiting
- [ ] Configure HTTPS

---

## 📝 Notes

- **Distances** calculated using Haversine formula (accurate within 0.2%)
- **Severity prediction** based on speed × vehicle multiplier
- **Alert routing** automatically determines service types based on severity
- **Sample data** designed for realistic hackathon demo

---

## 🤝 Contributing

This backend is production-ready and modular. To add features:

1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Add route to `app.js`

---

## 📧 Support

For issues or questions, check the backend logs and ensure:
- MongoDB is running
- Port 5000 is available
- `.env` file is properly configured
- All dependencies are installed (`npm install`)

---

**Happy Coding! 🚀**
