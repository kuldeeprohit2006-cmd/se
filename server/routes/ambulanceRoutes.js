const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const ambulanceData = {
  national: [
    { org: 'National Emergency', name: 'All India Emergency', city: 'Pan India', number: '112', tag: 'govt' },
    { org: 'Health Ministry', name: 'National Ambulance', city: 'Pan India', number: '102', tag: 'govt' },
    { org: 'EMRI', name: 'Emergency Medical Response', city: 'Pan India', number: '108', tag: 'govt' },
    { org: 'Fire & Emergency', name: 'Fire Services', city: 'Pan India', number: '101', tag: 'govt' },
    { org: 'Poison Control', name: 'Poison Helpline', city: 'Pan India', number: '1800-180-1104', tag: 'free' },
    { org: 'Mental Health', name: 'iCall Helpline', city: 'Pan India', number: '9152987821', tag: 'free' },
  ],
  north: [
    { org: 'Delhi Govt.', name: 'CATS Ambulance Delhi', city: 'Delhi', number: '102', tag: 'govt' },
    { org: 'Delhi Govt.', name: 'Delhi Emergency', city: 'Delhi', number: '011-23235699', tag: 'govt' },
    { org: 'UP Govt.', name: 'UP Emergency Service', city: 'Uttar Pradesh', number: '102', tag: 'govt' },
    { org: 'AIIMS Delhi', name: 'AIIMS Emergency', city: 'New Delhi', number: '011-26593318', tag: 'govt' },
    { org: 'Fortis', name: 'Fortis Hospital Delhi', city: 'New Delhi', number: '1800-11-4567', tag: 'private' },
    { org: 'Chandigarh Govt.', name: 'PGI Ambulance', city: 'Chandigarh', number: '0172-2756565', tag: 'govt' },
    { org: 'Punjab Govt.', name: 'Punjab Emergency', city: 'Punjab', number: '108', tag: 'govt' },
    { org: 'Haryana Govt.', name: 'Haryana EMRI', city: 'Haryana', number: '108', tag: 'govt' },
  ],
  south: [
    { org: 'Tamil Nadu Govt.', name: 'TN Emergency Service', city: 'Tamil Nadu', number: '104', tag: 'govt' },
    { org: 'AP Govt.', name: 'Andhra Pradesh EMRI', city: 'Andhra Pradesh', number: '108', tag: 'govt' },
    { org: 'Karnataka Govt.', name: 'Karnataka EMRI', city: 'Bangalore', number: '108', tag: 'govt' },
    { org: 'Apollo Hospitals', name: 'Apollo Emergency Chennai', city: 'Chennai', number: '044-28293333', tag: 'private' },
    { org: 'Kerala Govt.', name: 'Kerala EMRI', city: 'Kerala', number: '108', tag: 'govt' },
    { org: 'Telangana Govt.', name: 'Telangana Emergency', city: 'Hyderabad', number: '108', tag: 'govt' },
    { org: 'CMC Vellore', name: 'CMC Emergency', city: 'Vellore', number: '0416-2281000', tag: 'private' },
    { org: 'NIMHANS', name: 'NIMHANS Emergency', city: 'Bangalore', number: '080-46110007', tag: 'govt' },
  ],
  east: [
    { org: 'West Bengal Govt.', name: 'WB Emergency', city: 'West Bengal', number: '108', tag: 'govt' },
    { org: 'SSKM Hospital', name: 'SSKM Emergency', city: 'Kolkata', number: '033-22044440', tag: 'govt' },
    { org: 'Odisha Govt.', name: 'Odisha EMRI', city: 'Odisha', number: '108', tag: 'govt' },
    { org: 'Bihar Govt.', name: 'Bihar Emergency', city: 'Bihar', number: '108', tag: 'govt' },
    { org: 'Jharkhand Govt.', name: 'Jharkhand EMRI', city: 'Jharkhand', number: '108', tag: 'govt' },
    { org: 'Assam Govt.', name: 'Assam Emergency', city: 'Assam', number: '108', tag: 'govt' },
  ],
  west: [
    { org: 'Maharashtra Govt.', name: 'Mumbai Emergency', city: 'Mumbai', number: '022-23075000', tag: 'govt' },
    { org: 'GVK EMRI', name: 'Maharashtra EMRI', city: 'Maharashtra', number: '108', tag: 'govt' },
    { org: 'Gujarat Govt.', name: 'Gujarat EMRI', city: 'Gujarat', number: '108', tag: 'govt' },
    { org: 'KEM Hospital', name: 'KEM Emergency', city: 'Mumbai', number: '022-24136000', tag: 'govt' },
    { org: 'Rajasthan Govt.', name: 'Rajasthan Emergency', city: 'Rajasthan', number: '108', tag: 'govt' },
    { org: 'Lilavati Hospital', name: 'Lilavati Emergency', city: 'Mumbai', number: '022-26751000', tag: 'private' },
    { org: 'Goa Govt.', name: 'Goa Emergency', city: 'Goa', number: '0832-2458727', tag: 'govt' },
    { org: 'MP Govt.', name: 'MP EMRI', city: 'Madhya Pradesh', number: '108', tag: 'govt' },
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
    return res.status(404).json({ message: 'Region not found' });
  }
  res.json({ success: true, data: ambulanceData[region] });
});

module.exports = router;
