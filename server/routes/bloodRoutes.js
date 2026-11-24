const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const bloodDonorData = [
  { org: 'Indian Red Cross Society', city: 'Pan India', types: ['A+','A-','B+','B-','AB+','AB-','O+','O-'], phone: '011-23711551', available: '24/7' },
  { org: 'eRaktKosh – National Blood Bank', city: 'Pan India (Online)', types: ['A+','B+','O+','AB+'], phone: '1800-180-1104', available: '9AM-6PM' },
  { org: 'Indian Blood Donors Network', city: 'Pan India', types: ['O-','AB-','B-','A-'], phone: '9820052040', available: '24/7' },
  { org: 'AIIMS Blood Bank Delhi', city: 'New Delhi', types: ['A+','A-','B+','O+','O-'], phone: '011-26588703', available: '24/7' },
  { org: 'Rotary Blood Bank', city: 'Delhi', types: ['A+','B+','AB+','O+'], phone: '011-45794578', available: '8AM-8PM' },
  { org: 'Sankalp India Foundation', city: 'Bangalore', types: ['O-','B-','AB-'], phone: '9480044444', available: '24/7' },
  { org: 'Life Blood Centre', city: 'Mumbai', types: ['A+','B+','O+','O-'], phone: '022-23085880', available: '24/7' },
  { org: 'Vellore Blood Donors Association', city: 'Vellore', types: ['AB+','AB-','O-'], phone: '9442445545', available: '8AM-10PM' },
  { org: 'Kolkata Blood Bank Network', city: 'Kolkata', types: ['A+','B+','O+','B-'], phone: '033-22625740', available: '24/7' },
  { org: 'Chennai Blood Donors', city: 'Chennai', types: ['A-','B-','O-','AB-'], phone: '044-26420020', available: '10AM-6PM' },
  { org: 'Hyderabad Blood Bank', city: 'Hyderabad', types: ['O+','O-','A+','B+'], phone: '040-23311414', available: '24/7' },
  { org: 'Pune Blood Donors Club', city: 'Pune', types: ['AB+','O+','B+'], phone: '020-26057222', available: '9AM-9PM' },
];

// GET /api/blood — Protected
router.get('/', protect, (req, res) => {
  const { type } = req.query;
  let data = bloodDonorData;
  if (type && type !== 'all') {
    data = bloodDonorData.filter(d => d.types.includes(type));
  }
  res.json({ success: true, data });
});

module.exports = router;
