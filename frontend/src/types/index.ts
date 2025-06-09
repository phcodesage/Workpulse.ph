export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  createdAt: Date;
}

export interface Employer {
  id: string;
  userId: string;
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website?: string;
  description: string;
  logo?: string;
}

export interface JobSeeker {
  id: string;
  userId: string;
  title: string;
  skills: string[];
  experience: number; // years
  education: Education[];
  workHistory: WorkHistory[];
  hourlyRate?: number;
  availability: 'full-time' | 'part-time' | 'contract';
  location: string;
  photo?: string;
  bio: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}

export interface WorkHistory {
  id: string;
  company: string;
  position: string;
  from: Date;
  to?: Date;
  current: boolean;
  description: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  paymentType: 'hourly' | 'fixed';
  budget: number;
  location: string;
  remote: boolean;
  status: 'open' | 'closed';
  createdAt: Date;
  applications: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobSeekerId: string;
  coverLetter: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export const jobCategories = [
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
];

export const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'intermediate', label: 'Intermediate (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' }
];