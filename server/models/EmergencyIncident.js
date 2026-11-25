const mongoose = require('mongoose');

const emergencyIncidentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentRollNo: {
    type: String,
    default: ''
  },
  studentBranch: {
    type: String,
    default: 'General'
  },
  studentPhone: {
    type: String,
    default: '108 / Campus Security'
  },
  campusZone: {
    type: String,
    required: true,
    enum: [
      'Boys Hostel 1',
      'Boys Hostel 2',
      'Girls Hostel',
      'Academic Block - Ground Floor',
      'Academic Block - Labs / 1st Floor',
      'Campus Dispensary / Health Center',
      'Student Mess / Dining Hall',
      'Sports Complex / Grounds',
      'Main Campus Gate 1',
      'Other / Off-Campus'
    ],
    default: 'Academic Block - Ground Floor'
  },
  emergencyType: {
    type: String,
    required: true,
    enum: [
      'Cardiac Arrest / CPR Needed',
      'Severe Breathing / Choking',
      'Unconsciousness / Fainting',
      'Accidental Trauma / Deep Bleeding',
      'Severe Allergic Reaction / Anaphylaxis',
      'High Fever / Acute Illness',
      'Poisoning / Chemical Contact',
      'Other Medical Emergency'
    ],
    default: 'Cardiac Arrest / CPR Needed'
  },
  priority: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MEDIUM'],
    default: 'CRITICAL'
  },
  status: {
    type: String,
    enum: ['TRIGGERED', 'DISPATCHED', 'ARRIVED', 'RESOLVED'],
    default: 'TRIGGERED'
  },
  gpsCoordinates: {
    lat: { type: Number, default: 26.8016 }, // IIIT Lucknow coords
    lng: { type: Number, default: 81.0242 }
  },
  callSessionId: {
    type: String,
    default: ''
  },
  dispatcherNotes: {
    type: String,
    default: 'Emergency dispatch alerted. On-campus ambulance & warden notified.'
  },
  dispatchedAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyIncident', emergencyIncidentSchema);
