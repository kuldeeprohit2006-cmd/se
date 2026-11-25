const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const ambulanceData = {
  national: [
    { id: 'nat-108', type: 'GOVT AMBULANCE', name: '108 Emergency Medical Response (EMRI)', desc: 'Free 24/7 GPS-dispatched Advanced Life Support ambulance across UP & India.', phone: '108', city: 'Pan India', responseTime: '10-15 mins' },
    { id: 'nat-112', type: 'ALL-IN-ONE SOS', name: '112 National Emergency Helpline', desc: 'Unified Police, Ambulance & Disaster response dispatched via ERSS.', phone: '112', city: 'Pan India', responseTime: '8-12 mins' },
    { id: 'nat-102', type: 'MATERNITY & GENERAL', name: '102 National Ambulance Service', desc: 'Free patient transport & maternal-child medical emergency ambulance.', phone: '102', city: 'Pan India', responseTime: '12-18 mins' },
    { id: 'nat-poison', type: 'POISON CONTROL', name: 'National Poison Helpline (AIIMS)', desc: '24/7 clinical guidance for chemical, food, drug & toxin poisoning.', phone: '1800-180-1104', city: 'Pan India', responseTime: 'Instant' }
  ],
  campus: [
    { id: 'cam-1', type: 'ON-CAMPUS UNIT', name: 'IIIT Lucknow Campus Ambulance (AMB-101)', desc: 'Stationed at IIITL Main Gate 1 with oxygen cylinder, stretcher & trauma kit.', phone: '0522-2974730', city: 'IIITL Campus', responseTime: '2-3 mins' },
    { id: 'cam-2', type: 'CAMPUS DISPENSARY', name: 'IIITL Student Health Center & Medical Officer', desc: 'Campus dispensary emergency desk near Academic Block & Hostels.', phone: '0522-2974731', city: 'IIITL Campus', responseTime: '1-2 mins' },
    { id: 'cam-3', type: 'HOSTEL SECURITY', name: 'Hostel Warden & Quick Response Van', desc: '24/7 hostel security rapid transport to nearest Lucknow trauma hospital.', phone: '9450000108', city: 'Boys & Girls Hostel', responseTime: '2 mins' }
  ],
  hospitals: [
    { id: 'hos-1', type: 'TERTIARY ER', name: 'Medanta Super Speciality Hospital, Lucknow', desc: 'Nearest major multi-speciality trauma & cardiac ER (~12 mins via Sultanpur Rd).', phone: '0522-4505050', city: 'Lucknow', responseTime: '12 mins' },
    { id: 'hos-2', type: 'APEX TRAUMA', name: 'SGPGI Emergency & Trauma Center', desc: 'Apex tertiary critical care & neuro/cardiac ICU emergency referral.', phone: '0522-2668700', city: 'Lucknow', responseTime: '18 mins' },
    { id: 'hos-3', type: 'GOVT SUPER SPECIALITY', name: 'Dr. Ram Manohar Lohia Hospital (RMLIMS)', desc: '24/7 emergency & ICU trauma center in Gomti Nagar, Lucknow.', phone: '0522-6692000', city: 'Gomti Nagar', responseTime: '15 mins' },
    { id: 'hos-4', type: 'PRIVATE ER', name: 'Apollomedics Super Speciality Hospital', desc: '24/7 Emergency Ambulance & Cardiac Catheterization Unit.', phone: '0522-6788888', city: 'Kanpur Rd, Lucknow', responseTime: '20 mins' }
  ]
};

// GET /api/ambulance — Protected
router.get('/', protect, (req, res) => {
  res.json({ success: true, data: ambulanceData });
});

// GET /api/ambulance/:region — Protected
router.get('/:region', protect, (req, res) => {
  const region = req.params.region;
  if (!ambulanceData[region]) {
    return res.status(404).json({ message: 'Ambulance category not found' });
  }
  res.json({ success: true, data: ambulanceData[region] });
});

module.exports = router;
