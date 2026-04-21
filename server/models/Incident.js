const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'responded', 'resolved'],
      default: 'active',
    },
    description: {
      type: String,
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['bike', 'car', 'truck', 'bus', 'auto'],
    },
    speed: {
      type: Number, // in km/h
    },
    accidentDetected: {
      type: Boolean,
      default: false,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    assignedServices: [
      {
        serviceId: mongoose.Schema.Types.ObjectId,
        serviceName: String,
        distance: Number,
      },
    ],
    resolvedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location queries
incidentSchema.index({ latitude: 1, longitude: 1 });
incidentSchema.index({ createdAt: -1 });
incidentSchema.index({ status: 1 });

module.exports = mongoose.model('Incident', incidentSchema);
