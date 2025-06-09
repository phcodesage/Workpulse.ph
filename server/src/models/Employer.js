const mongoose = require('mongoose');

const EmployerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  industry: {
    type: String,
    required: [true, 'Please add an industry']
  },
  companySize: {
    type: String,
    required: [true, 'Please add company size']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  logo: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employer', EmployerSchema);
