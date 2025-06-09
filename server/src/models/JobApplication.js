const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  jobSeeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSeeker',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter'],
    maxlength: [1000, 'Cover letter cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Prevent job seeker from applying to the same job more than once
JobApplicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
