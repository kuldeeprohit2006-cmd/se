const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const EmergencyIncident = require('../models/EmergencyIncident');
const storage = require('../services/storageService');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const isDbConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// GET /api/admin/stats - Admin Command telemetry
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    let totalStudents = 5;
    let activeIncidents = 1;
    let resolvedIncidents = 0;
    let branchBreakdown = [
      { _id: 'CS', count: 1 },
      { _id: 'IT', count: 1 },
      { _id: 'CSAI', count: 1 },
      { _id: 'CSB', count: 1 }
    ];

    if (isDbConnected()) {
      totalStudents = await User.countDocuments({ role: 'student' });
      activeIncidents = await EmergencyIncident.countDocuments({ status: { $in: ['TRIGGERED', 'DISPATCHED'] } });
      resolvedIncidents = await EmergencyIncident.countDocuments({ status: 'RESOLVED' });
      const agg = await User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$branch', count: { $sum: 1 } } }
      ]);
      if (agg.length > 0) branchBreakdown = agg;
    }

    res.json({
      success: true,
      data: {
        totalStudents,
        activeIncidents,
        resolvedIncidents,
        totalIncidents: activeIncidents + resolvedIncidents,
        branchBreakdown,
        systemStatus: isDbConnected() ? 'ONLINE_MONGODB_ATLAS' : 'ONLINE_HYBRID_STORE',
        ambulanceFleet: [
          { id: 'AMB-101', status: 'AVAILABLE', location: 'IIITL Main Gate 1', eta: '2 mins' },
          { id: 'AMB-102', status: 'ON_STANDBY', location: 'Campus Health Dispensary', eta: '1 min' },
          { id: 'AMB-108', status: 'DISPATCH_READY', location: 'District Trauma Center', eta: '7 mins' }
        ]
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Error retrieving admin stats', error: error.message });
  }
});

// GET /api/admin/students - Student Directory (Filter by branch: LCS, LIT, LCI, LCB or roll range)
router.get('/students', protect, adminOnly, async (req, res) => {
  try {
    const { branch, branchCode, rollNo, search } = req.query;
    let students = [];

    if (isDbConnected()) {
      let query = { role: 'student' };
      if (branch && branch !== 'all') query.branch = branch;
      if (branchCode && branchCode !== 'all') query.branchCode = branchCode.toLowerCase();
      if (rollNo) query.rollNo = rollNo;
      if (search) {
        const q = search.toLowerCase();
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { rollNo: { $regex: q, $options: 'i' } }
        ];
      }
      students = await User.find(query).select('-password').sort({ branch: 1, rollNo: 1 });
    }

    if (students.length === 0) {
      students = storage.getAllStudents({ branch, branchCode, rollNo });
    }

    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

module.exports = router;
