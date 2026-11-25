const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EmergencyIncident = require('../models/EmergencyIncident');
const storage = require('../services/storageService');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// POST /api/incidents - Trigger a new SOS Emergency
router.post('/', protect, async (req, res) => {
  try {
    const { campusZone, emergencyType, priority, gpsCoordinates, notes, studentPhone } = req.body;

    const incidentData = {
      student: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentRollNo: req.user.rollNo || '',
      studentBranch: req.user.branch || 'General',
      studentPhone: studentPhone || req.user.phone || '108 / Campus Security',
      campusZone: campusZone || req.user.campusLocation || 'Academic Block - Ground Floor',
      emergencyType: emergencyType || 'Cardiac Arrest / CPR Needed',
      priority: priority || 'CRITICAL',
      status: 'TRIGGERED',
      gpsCoordinates: gpsCoordinates || { lat: 26.8016, lng: 81.0242 },
      dispatcherNotes: notes || 'Student triggered one-touch SOS dispatch. On-campus ambulance & warden alerted.'
    };

    let incident;
    if (isDbConnected()) {
      incident = await EmergencyIncident.create(incidentData);
    } else {
      incident = storage.addIncident(incidentData);
    }

    res.status(201).json({
      success: true,
      message: '🚨 Emergency Incident Broadcasted to Campus Response Team!',
      incident
    });
  } catch (error) {
    console.error('Trigger incident error:', error);
    res.status(500).json({ message: 'Error triggering emergency incident', error: error.message });
  }
});

// GET /api/incidents - Get incidents list
router.get('/', protect, async (req, res) => {
  try {
    let incidents = [];
    if (isDbConnected()) {
      let query = {};
      if (req.user.role !== 'admin') {
        query.student = req.user._id;
      }
      incidents = await EmergencyIncident.find(query).sort({ createdAt: -1 }).limit(50);
    }
    
    if (incidents.length === 0) {
      incidents = storage.getIncidents(req.user);
    }

    res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error) {
    console.error('Fetch incidents error:', error);
    res.status(500).json({ message: 'Error retrieving incidents', error: error.message });
  }
});

// PATCH /api/incidents/:id/status - Update incident status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, dispatcherNotes } = req.body;
    let incident;

    if (isDbConnected()) {
      const updateData = {};
      if (status) {
        updateData.status = status;
        if (status === 'DISPATCHED') updateData.dispatchedAt = new Date();
        if (status === 'RESOLVED') updateData.resolvedAt = new Date();
      }
      if (dispatcherNotes) updateData.dispatcherNotes = dispatcherNotes;

      incident = await EmergencyIncident.findByIdAndUpdate(req.params.id, updateData, { new: true });
    }

    if (!incident) {
      incident = storage.updateIncidentStatus(req.params.id, status, dispatcherNotes);
    }

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ success: true, message: `Status updated to ${status}`, incident });
  } catch (error) {
    console.error('Update incident status error:', error);
    res.status(500).json({ message: 'Error updating incident status', error: error.message });
  }
});

// POST /api/incidents/:id/call - Connect simulated audio dispatch call
router.post('/:id/call', protect, async (req, res) => {
  try {
    const callSessionId = `DISPATCH-CALL-${Date.now()}`;
    let incident;

    if (isDbConnected()) {
      incident = await EmergencyIncident.findByIdAndUpdate(
        req.params.id,
        {
          callSessionId,
          dispatcherNotes: 'Student connected via 2-Way Emergency Audio Dispatch Channel.'
        },
        { new: true }
      );
    }

    if (!incident) {
      incident = storage.updateIncidentStatus(req.params.id, null, 'Student connected via 2-Way Emergency Audio Dispatch Channel.');
    }

    res.json({
      success: true,
      callSessionId,
      incident,
      operatorMessage: 'MediGuard Emergency Dispatch connected. Stay calm. An ambulance is being routed.'
    });
  } catch (error) {
    console.error('Connect dispatch call error:', error);
    res.status(500).json({ message: 'Error establishing call session', error: error.message });
  }
});

// POST /api/incidents/call-bridge - Real Telephony API (Twilio) + WebRTC Call Room Generator
router.post('/call-bridge', protect, async (req, res) => {
  try {
    const { toNumber = '108', campusZone = 'Campus' } = req.body || {};
    const roomId = `MediGuard-IIITL-${Date.now().toString(36)}`;
    const webrtcUrl = `https://meet.jit.si/${roomId}`;

    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (sid && token && fromNumber && toNumber) {
      const authHeader = Buffer.from(`${sid}:${token}`).toString('base64');
      const params = new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        Twiml: `<Response><Say>MediGuard Campus Emergency Alert from ${campusZone}. A student has requested immediate assistance.</Say></Response>`
      });

      const twilioResp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const twilioData = await twilioResp.json();
      if (!twilioResp.ok) {
        return res.status(twilioResp.status).json({
          success: false,
          mode: 'twilio-error',
          message: twilioData.message || 'Twilio API call failed',
          webrtcUrl
        });
      }

      return res.json({
        success: true,
        mode: 'twilio-pstn',
        callSid: twilioData.sid,
        status: twilioData.status,
        webrtcUrl
      });
    }

    return res.json({
      success: true,
      mode: 'webrtc-bridge',
      roomId,
      webrtcUrl,
      telUri: `tel:${toNumber}`
    });
  } catch (error) {
    console.error('Call bridge error:', error);
    res.status(500).json({ success: false, message: 'Call bridge error', error: error.message });
  }
});

module.exports = router;
