const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Please add an institution name']
  },
  degree: {
    type: String,
    required: [true, 'Please add a degree']
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Please add a field of study']
  },
  from: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  }
});

const WorkHistorySchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  from: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  }
});

const JobSeekerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a professional title']
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  education: [EducationSchema],
  workHistory: [WorkHistorySchema],
  hourlyRate: {
    type: Number
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    required: [true, 'Please specify availability']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  photo: {
    type: String
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobSeeker', JobSeekerSchema);
