// In-memory robust fallback store when MongoDB Atlas connection is in transition
const bcrypt = require('bcryptjs');

class StorageService {
  constructor() {
    this.users = new Map();
    this.incidents = [];
    this.initDemoAccounts();
  }

  async initDemoAccounts() {
    const salt = await bcrypt.genSalt(10);
    const studentHash = await bcrypt.hash('Student@123', salt);
    const adminHash = await bcrypt.hash('Admin@123', salt);

    const defaultUsers = [
      {
        _id: 'usr_admin_01',
        name: 'Campus Emergency Admin',
        email: 'admin@iiitl.ac.in',
        password: adminHash,
        role: 'admin',
        college: 'IIIT Lucknow',
        branch: 'General',
        branchCode: 'general',
        campusLocation: 'Campus Health Center',
        authProvider: 'local',
        createdAt: new Date()
      },
      {
        _id: 'usr_lcs_044',
        name: 'Kuldeep (CS Roll 44)',
        email: 'lcs2025044@iiitl.ac.in',
        password: studentHash,
        role: 'student',
        college: 'IIIT Lucknow',
        branch: 'CS',
        branchCode: 'lcs',
        batch: '2025',
        rollNo: '044',
        campusLocation: 'Boys Hostel 1',
        authProvider: 'local',
        createdAt: new Date()
      },
      {
        _id: 'usr_lit_012',
        name: 'Aditya (IT Roll 12)',
        email: 'lit2025012@iiitl.ac.in',
        password: studentHash,
        role: 'student',
        college: 'IIIT Lucknow',
        branch: 'IT',
        branchCode: 'lit',
        batch: '2025',
        rollNo: '012',
        campusLocation: 'Boys Hostel 2',
        authProvider: 'local',
        createdAt: new Date()
      },
      {
        _id: 'usr_lci_033',
        name: 'Sneha (CSAI Roll 33)',
        email: 'lci2025033@iiitl.ac.in',
        password: studentHash,
        role: 'student',
        college: 'IIIT Lucknow',
        branch: 'CSAI',
        branchCode: 'lci',
        batch: '2025',
        rollNo: '033',
        campusLocation: 'Girls Hostel',
        authProvider: 'local',
        createdAt: new Date()
      },
      {
        _id: 'usr_lcb_007',
        name: 'Rohan (CSB Roll 7)',
        email: 'lcb2025007@iiitl.ac.in',
        password: studentHash,
        role: 'student',
        college: 'IIIT Lucknow',
        branch: 'CSB',
        branchCode: 'lcb',
        batch: '2025',
        rollNo: '007',
        campusLocation: 'Boys Hostel 1',
        authProvider: 'local',
        createdAt: new Date()
      },
      {
        _id: 'usr_norm_01',
        name: 'Demo Student',
        email: 'student@campus.edu',
        password: studentHash,
        role: 'student',
        college: 'Campus Emergency Cell',
        branch: 'General',
        branchCode: 'general',
        campusLocation: 'Boys Hostel 1',
        authProvider: 'local',
        createdAt: new Date()
      }
    ];

    for (const u of defaultUsers) {
      this.users.set(u.email, u);
    }

    // Default emergency incident for Admin view
    this.incidents.push({
      _id: 'inc_sample_01',
      student: 'usr_lcs_044',
      studentName: 'Kuldeep (CS Roll 44)',
      studentEmail: 'lcs2025044@iiitl.ac.in',
      studentRollNo: '044',
      studentBranch: 'CS',
      studentPhone: '108 / Campus Security',
      campusZone: 'Academic Block - Ground Floor',
      emergencyType: 'Cardiac Arrest / CPR Needed',
      priority: 'CRITICAL',
      status: 'TRIGGERED',
      gpsCoordinates: { lat: 26.8016, lng: 81.0242 },
      callSessionId: 'DISPATCH-CALL-DEMO',
      dispatcherNotes: 'Incident reported at Academic Block. Medical team dispatched.',
      createdAt: new Date(Date.now() - 5 * 60 * 1000)
    });
  }

  findUserByEmail(email) {
    return this.users.get(email.toLowerCase());
  }

  findUserById(id) {
    for (const u of this.users.values()) {
      if (u._id === id || String(u._id) === String(id)) return u;
    }
    return null;
  }

  addUser(userData) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const user = { ...userData, _id: id, createdAt: new Date() };
    this.users.set(user.email.toLowerCase(), user);
    return user;
  }

  getAllStudents(filter = {}) {
    const list = Array.from(this.users.values()).filter(u => u.role === 'student');
    return list.filter(u => {
      if (filter.branch && filter.branch !== 'all' && u.branch !== filter.branch) return false;
      if (filter.branchCode && filter.branchCode !== 'all' && u.branchCode !== filter.branchCode) return false;
      if (filter.rollNo && u.rollNo !== filter.rollNo) return false;
      return true;
    });
  }

  addIncident(incidentData) {
    const id = `inc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const incident = { ...incidentData, _id: id, createdAt: new Date() };
    this.incidents.unshift(incident);
    return incident;
  }

  getIncidents(user) {
    if (user.role === 'admin') return this.incidents;
    return this.incidents.filter(inc => String(inc.student) === String(user._id) || inc.studentEmail === user.email);
  }

  updateIncidentStatus(id, status, notes) {
    const inc = this.incidents.find(i => String(i._id) === String(id));
    if (!inc) return null;
    if (status) {
      inc.status = status;
      if (status === 'DISPATCHED') inc.dispatchedAt = new Date();
      if (status === 'RESOLVED') inc.resolvedAt = new Date();
    }
    if (notes) inc.dispatcherNotes = notes;
    return inc;
  }
}

module.exports = new StorageService();
