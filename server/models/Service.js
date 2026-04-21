const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['hospital', 'police', 'ambulance', 'towing', 'puncture'],
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    responseTime: {
      type: Number, // in minutes
      default: 5,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create geospatial index for location queries
serviceSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Service', serviceSchema);
