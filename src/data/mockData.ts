import { User, Employer, JobSeeker, Job, JobApplication, Message } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    role: 'employer',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@webexpert.com',
    role: 'jobseeker',
    createdAt: new Date('2023-02-10')
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@digitalagency.com',
    role: 'employer',
    createdAt: new Date('2023-01-20')
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@developer.com',
    role: 'jobseeker',
    createdAt: new Date('2023-03-05')
  }
];

// Mock Employers
export const employers: Employer[] = [
  {
    id: '1',
    userId: '1',
    companyName: 'TechCorp Solutions',
    industry: 'Technology',
    companySize: '50-100',
    location: 'New York, USA',
    website: 'https://techcorp.example.com',
    description: 'Leading technology solutions provider specializing in web and mobile applications.',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    userId: '3',
    companyName: 'Digital Creative Agency',
    industry: 'Marketing',
    companySize: '10-50',
    location: 'San Francisco, USA',
    website: 'https://digitalagency.example.com',
    description: 'Creative digital agency focused on brand development and digital marketing.',
    logo: 'https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Mock JobSeekers
export const jobSeekers: JobSeeker[] = [
  {
    id: '1',
    userId: '2',
    title: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    experience: 5,
    education: [
      {
        id: '1',
        institution: 'University of Technology',
        degree: 'Bachelor',
        fieldOfStudy: 'Computer Science',
        from: new Date('2014-09-01'),
        to: new Date('2018-06-30'),
        current: false,
        description: 'Specialized in Web Development'
      }
    ],
    workHistory: [
      {
        id: '1',
        company: 'Web Solutions Inc.',
        position: 'Frontend Developer',
        from: new Date('2018-07-01'),
        to: new Date('2021-12-31'),
        current: false,
        description: 'Developed and maintained frontend applications using React and TypeScript.'
      },
      {
        id: '2',
        company: 'Tech Innovators',
        position: 'Senior Frontend Developer',
        from: new Date('2022-01-15'),
        current: true,
        description: 'Leading frontend development for multiple client projects.'
      }
    ],
    hourlyRate: 35,
    availability: 'full-time',
    location: 'Remote',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Passionate frontend developer with 5+ years of experience building responsive and user-friendly web applications.'
  },
  {
    id: '2',
    userId: '4',
    title: 'Full Stack Developer',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'Express'],
    experience: 3,
    education: [
      {
        id: '1',
        institution: 'Digital Academy',
        degree: 'Bachelor',
        fieldOfStudy: 'Software Engineering',
        from: new Date('2016-09-01'),
        to: new Date('2020-06-30'),
        current: false,
        description: 'Focus on full stack development'
      }
    ],
    workHistory: [
      {
        id: '1',
        company: 'CodeMasters LLC',
        position: 'Junior Developer',
        from: new Date('2020-08-01'),
        to: new Date('2022-03-31'),
        current: false,
        description: 'Worked on backend services and database design.'
      },
      {
        id: '2',
        company: 'AppDev Studio',
        position: 'Full Stack Developer',
        from: new Date('2022-04-15'),
        current: true,
        description: 'Developing full stack applications using React and Node.js.'
      }
    ],
    hourlyRate: 30,
    availability: 'full-time',
    location: 'Chicago, USA',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Versatile full stack developer passionate about building scalable web applications and learning new technologies.'
  }
];

// Mock Jobs
export const jobs: Job[] = [
  {
    id: '1',
    employerId: '1',
    title: 'Frontend React Developer',
    description: 'We are looking for an experienced React developer to join our team. You will be responsible for building and maintaining our client-facing web applications.',
    category: 'Web Development',
    skills: ['React', 'TypeScript', 'CSS', 'Redux'],
    experienceLevel: 'intermediate',
    paymentType: 'hourly',
    budget: 30,
    location: 'Remote',
    remote: true,
    status: 'open',
    createdAt: new Date('2023-05-15'),
    applications: []
  },
  {
    id: '2',
    employerId: '1',
    title: 'UI/UX Designer',
    description: 'Looking for a creative UI/UX designer to help redesign our product interface. You should have strong skills in user research, wireframing, and prototyping.',
    category: 'Design',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    experienceLevel: 'expert',
    paymentType: 'hourly',
    budget: 35,
    location: 'New York, USA',
    remote: false,
    status: 'open',
    createdAt: new Date('2023-05-20'),
    applications: []
  },
  {
    id: '3',
    employerId: '2',
    title: 'Content Writer',
    description: 'We need a skilled content writer to create engaging blog posts, articles, and social media content for our clients in the tech industry.',
    category: 'Writing',
    skills: ['Content Writing', 'SEO', 'Editing', 'Research'],
    experienceLevel: 'entry',
    paymentType: 'fixed',
    budget: 500,
    location: 'Remote',
    remote: true,
    status: 'open',
    createdAt: new Date('2023-06-01'),
    applications: []
  },
  {
    id: '4',
    employerId: '2',
    title: 'Full Stack Developer',
    description: 'Seeking a full stack developer proficient in React and Node.js to help build a new e-commerce platform for one of our clients.',
    category: 'Web Development',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    experienceLevel: 'intermediate',
    paymentType: 'hourly',
    budget: 40,
    location: 'San Francisco, USA',
    remote: true,
    status: 'open',
    createdAt: new Date('2023-06-10'),
    applications: []
  }
];

// Mock Applications
export const applications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    jobSeekerId: '1',
    coverLetter: 'I have extensive experience with React and TypeScript and would love to join your team. My previous work includes building complex frontend applications for e-commerce platforms.',
    status: 'reviewing',
    createdAt: new Date('2023-05-18')
  },
  {
    id: '2',
    jobId: '3',
    jobSeekerId: '2',
    coverLetter: 'I am a skilled content writer with expertise in creating technical content. I have worked with several tech blogs and understand SEO best practices.',
    status: 'pending',
    createdAt: new Date('2023-06-05')
  },
  {
    id: '3',
    jobId: '4',
    jobSeekerId: '2',
    coverLetter: 'As a full stack developer with experience in React and Node.js, I believe I am a perfect fit for this position. I have built several e-commerce platforms in the past.',
    status: 'pending',
    createdAt: new Date('2023-06-12')
  }
];

// Add applications to jobs
jobs[0].applications.push(applications[0]);
jobs[2].applications.push(applications[1]);
jobs[3].applications.push(applications[2]);

// Mock Messages
export const messages: Message[] = [
  {
    id: '1',
    senderId: '1', // John (employer)
    receiverId: '2', // Sarah (jobseeker)
    content: 'Hi Sarah, I was impressed by your application. When would you be available for an interview?',
    read: true,
    createdAt: new Date('2023-05-20T10:30:00')
  },
  {
    id: '2',
    senderId: '2', // Sarah (jobseeker)
    receiverId: '1', // John (employer)
    content: 'Hello John, thank you for considering my application. I\'m available for an interview any weekday next week between 9 AM and 3 PM. Looking forward to discussing the position further.',
    read: true,
    createdAt: new Date('2023-05-20T14:15:00')
  },
  {
    id: '3',
    senderId: '1', // John (employer)
    receiverId: '2', // Sarah (jobseeker)
    content: 'Perfect! Let\'s schedule it for next Tuesday at 10 AM. I\'ll send you a calendar invite with the meeting details.',
    read: false,
    createdAt: new Date('2023-05-21T09:45:00')
  }
];