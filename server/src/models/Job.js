const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Design',
      'Writing',
      'Customer Service',
      'Marketing',
      'Sales',
      'Admin Support',
      'Accounting',
      'Data Entry',
      'Engineering',
      'Other'
    ]
  },
  skills: {
    type: [String],
    required: [true, 'Please add required skills']
  },
  experienceLevel: {
    type: String,
    required: [true, 'Please specify experience level'],
    enum: ['entry', 'intermediate', 'expert']
  },
  paymentType: {
    type: String,
    required: [true, 'Please specify payment type'],
    enum: ['hourly', 'fixed']
  },
  budget: {
    type: Number,
    required: [true, 'Please add a budget']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  remote: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate applications
JobSchema.virtual('applications', {
  ref: 'JobApplication',
  localField: '_id',
  foreignField: 'job',
  justOne: false
});

module.exports = mongoose.model('Job', JobSchema);
