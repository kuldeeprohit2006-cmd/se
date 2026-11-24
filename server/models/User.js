const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  college: {
    type: String,
    trim: true,
    default: 'IIIT Lucknow'
  },
  branch: {
    type: String,
    enum: ['CS', 'IT', 'CSAI', 'CSB', 'General'],
    default: 'General'
  },
  branchCode: {
    type: String,
    enum: ['lcs', 'lit', 'lci', 'lcb', 'general'],
    default: 'general'
  },
  rollNo: {
    type: String,
    default: ''
  },
  batch: {
    type: String,
    default: '2025'
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  campusLocation: {
    type: String,
    default: 'Boys Hostel 1'
  }
}, { timestamps: true });

// Parse IIIT Lucknow email: e.g. lcs2025044@iiitl.ac.in
userSchema.statics.parseIIITLEmail = function(email) {
  const match = email.toLowerCase().match(/^([a-z]{3})(\d{4})(\d{3})@iiitl\.ac\.in$/);
  if (!match) return null;
  const [, prefix, batch, rollNo] = match;
  const branchMap = {
    'lcs': 'CS',
    'lit': 'IT',
    'lci': 'CSAI',
    'lcb': 'CSB'
  };
  return {
    branchCode: prefix,
    branch: branchMap[prefix] || 'General',
    batch,
    rollNo,
    isIIITL: true
  };
};

// Hash password before saving if present and modified
userSchema.pre('save', async function(next) {
  if (!this.password || !this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
