const axios = require('axios');
const colors = require('colors');

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Store auth token
let token = '';
let userId = '';
let employerId = '';
let jobSeekerId = '';
let jobId = '';
let applicationId = '';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'employer'
};

const testJobSeekerUser = {
  name: 'Test Job Seeker',
  email: 'jobseeker@example.com',
  password: 'password123',
  role: 'jobseeker'
};

// Test employer profile
const testEmployerProfile = {
  companyName: 'Test Company',
  industry: 'Technology',
  location: 'Manila, Philippines',
  website: 'https://testcompany.com',
  description: 'A test company for API testing'
};

// Test job seeker profile
const testJobSeekerProfile = {
  title: 'Software Engineer',
  skills: ['JavaScript', 'React', 'Node.js'],
  location: 'Manila, Philippines',
  bio: 'Experienced software engineer looking for opportunities'
};

// Test job
const testJob = {
  title: 'Frontend Developer',
  description: 'We are looking for a skilled frontend developer to join our team.',
  location: 'Manila, Philippines',
  salary: '₱50,000 - ₱70,000',
  type: 'full-time',
  category: 'Web Development',
  skills: ['JavaScript', 'React', 'CSS'],
  requirements: ['2+ years of experience', 'Bachelor\'s degree']
};

// Test application
const testApplication = {
  coverLetter: 'I am very interested in this position and believe my skills and experience make me a strong candidate. I have worked with React for over 3 years and have built several production applications.',
  resume: 'https://example.com/resume.pdf'
};

// Helper function to log responses
const logResponse = (endpoint, status, data) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`ENDPOINT: ${endpoint}`.cyan);
  console.log(`STATUS: ${status === 200 || status === 201 ? status.toString().green : status.toString().red}`);
  console.log('RESPONSE DATA:');
  console.log(JSON.stringify(data, null, 2));
  console.log(`${'='.repeat(50)}\n`);
};

// Helper function to make API requests
const makeRequest = async (method, endpoint, data = null, authRequired = false) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (authRequired && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`Making ${method} request to ${API_URL}${endpoint}`.cyan);
    if (data) {
      console.log('Request data:'.cyan, JSON.stringify(data, null, 2));
    }

    let response;
    if (method === 'GET') {
      response = await axios.get(`${API_URL}${endpoint}`, config);
    } else if (method === 'POST') {
      response = await axios.post(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'PUT') {
      response = await axios.put(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'DELETE') {
      response = await axios.delete(`${API_URL}${endpoint}`, config);
    }

    logResponse(endpoint, response.status, response.data);
    return response.data;
  } catch (error) {
    console.log('Error details:'.red);
    if (error.response) {
      console.log(`Status: ${error.response.status}`.red);
      console.log('Response data:'.red, JSON.stringify(error.response.data, null, 2));
      logResponse(endpoint, error.response.status, error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log('No response received from server'.red);
      console.log('Request details:'.red, error.request._currentUrl);
      return { success: false, error: 'No response received from server' };
    } else {
      console.error(`Error with request to ${endpoint}:`.red, error.message);
      return { success: false, error: error.message };
    }
  }
};

// Main test function
const runTests = async () => {
  console.log('\n🚀 STARTING API ROUTE TESTS 🚀\n'.yellow.bold);

  // Test auth routes
  console.log('\n📝 TESTING AUTH ROUTES 📝\n'.magenta.bold);

  // Register employer
  console.log('Testing register endpoint...'.cyan);
  const registerResponse = await makeRequest('POST', '/auth/register', testUser);
  if (registerResponse.success) {
    token = registerResponse.token;
    userId = registerResponse.data._id;
    console.log('✅ Registration successful'.green);
  } else {
    console.log('❌ Registration failed'.red);
  }

  // Register job seeker
  console.log('Testing job seeker register endpoint...'.cyan);
  const jobSeekerRegisterResponse = await makeRequest('POST', '/auth/register', testJobSeekerUser);
  let jobSeekerToken = '';
  if (jobSeekerRegisterResponse.success) {
    jobSeekerToken = jobSeekerRegisterResponse.token;
    console.log('✅ Job seeker registration successful'.green);
  } else {
    console.log('❌ Job seeker registration failed'.red);
  }

  // Login
  console.log('Testing login endpoint...'.cyan);
  const loginResponse = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  if (loginResponse.success) {
    token = loginResponse.token;
    console.log('✅ Login successful'.green);
  } else {
    console.log('❌ Login failed'.red);
  }

  // Get current user
  console.log('Testing get current user endpoint...'.cyan);
  const meResponse = await makeRequest('GET', '/auth/me', null, true);
  if (meResponse.success) {
    console.log('✅ Get current user successful'.green);
  } else {
    console.log('❌ Get current user failed'.red);
  }

  // Test profile routes
  console.log('\n📝 TESTING PROFILE ROUTES 📝\n'.magenta.bold);

  // Create employer profile
  console.log('Testing create employer profile endpoint...'.cyan);
  const createEmployerProfileResponse = await makeRequest('POST', '/profiles/employer', testEmployerProfile, true);
  if (createEmployerProfileResponse.success) {
    employerId = createEmployerProfileResponse.data._id;
    console.log('✅ Create employer profile successful'.green);
  } else {
    console.log('❌ Create employer profile failed'.red);
  }

  // Login as job seeker
  console.log('Testing job seeker login endpoint...'.cyan);
  const jobSeekerLoginResponse = await makeRequest('POST', '/auth/login', {
    email: testJobSeekerUser.email,
    password: testJobSeekerUser.password
  });
  if (jobSeekerLoginResponse.success) {
    jobSeekerToken = jobSeekerLoginResponse.token;
    console.log('✅ Job seeker login successful'.green);
    token = jobSeekerToken; // Switch to job seeker token
  } else {
    console.log('❌ Job seeker login failed'.red);
  }

  // Create job seeker profile
  console.log('Testing create job seeker profile endpoint...'.cyan);
  const createJobSeekerProfileResponse = await makeRequest('POST', '/profiles/jobseeker', testJobSeekerProfile, true);
  if (createJobSeekerProfileResponse.success) {
    jobSeekerId = createJobSeekerProfileResponse.data._id;
    console.log('✅ Create job seeker profile successful'.green);
  } else {
    console.log('❌ Create job seeker profile failed'.red);
  }

  // Get my profile
  console.log('Testing get my profile endpoint...'.cyan);
  const myProfileResponse = await makeRequest('GET', '/profiles/me', null, true);
  if (myProfileResponse.success) {
    console.log('✅ Get my profile successful'.green);
  } else {
    console.log('❌ Get my profile failed'.red);
  }

  // Get employers
  console.log('Testing get employers endpoint...'.cyan);
  const employersResponse = await makeRequest('GET', '/profiles/employers');
  if (employersResponse.success) {
    console.log('✅ Get employers successful'.green);
  } else {
    console.log('❌ Get employers failed'.red);
  }

  // Get job seekers
  console.log('Testing get job seekers endpoint...'.cyan);
  const jobSeekersResponse = await makeRequest('GET', '/profiles/jobseekers');
  if (jobSeekersResponse.success) {
    console.log('✅ Get job seekers successful'.green);
  } else {
    console.log('❌ Get job seekers failed'.red);
  }

  // Get employer by ID
  if (employerId) {
    console.log('Testing get employer by ID endpoint...'.cyan);
    const employerResponse = await makeRequest('GET', `/profiles/employers/${employerId}`);
    if (employerResponse.success) {
      console.log('✅ Get employer by ID successful'.green);
    } else {
      console.log('❌ Get employer by ID failed'.red);
    }
  }

  // Get job seeker by ID
  if (jobSeekerId) {
    console.log('Testing get job seeker by ID endpoint...'.cyan);
    const jobSeekerResponse = await makeRequest('GET', `/profiles/jobseekers/${jobSeekerId}`);
    if (jobSeekerResponse.success) {
      console.log('✅ Get job seeker by ID successful'.green);
    } else {
      console.log('❌ Get job seeker by ID failed'.red);
    }
  }

  // Switch back to employer token
  console.log('Switching back to employer token...'.cyan);
  const employerLoginResponse = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  if (employerLoginResponse.success) {
    token = employerLoginResponse.token;
    console.log('✅ Employer login successful'.green);
  } else {
    console.log('❌ Employer login failed'.red);
  }

  // Test job routes
  console.log('\n📝 TESTING JOB ROUTES 📝\n'.magenta.bold);

  // Create job
  console.log('Testing create job endpoint...'.cyan);
  const createJobResponse = await makeRequest('POST', '/jobs', testJob, true);
  if (createJobResponse.success) {
    jobId = createJobResponse.data._id;
    console.log('✅ Create job successful'.green);
  } else {
    console.log('❌ Create job failed'.red);
  }

  // Get jobs
  console.log('Testing get jobs endpoint...'.cyan);
  const jobsResponse = await makeRequest('GET', '/jobs');
  if (jobsResponse.success) {
    console.log('✅ Get jobs successful'.green);
  } else {
    console.log('❌ Get jobs failed'.red);
  }

  // Get job by ID
  if (jobId) {
    console.log('Testing get job by ID endpoint...'.cyan);
    const jobResponse = await makeRequest('GET', `/jobs/${jobId}`);
    if (jobResponse.success) {
      console.log('✅ Get job by ID successful'.green);
    } else {
      console.log('❌ Get job by ID failed'.red);
    }
  }

  // Update job
  if (jobId) {
    console.log('Testing update job endpoint...'.cyan);
    const updateJobResponse = await makeRequest('PUT', `/jobs/${jobId}`, {
      title: 'Updated Frontend Developer',
      salary: '₱60,000 - ₱80,000'
    }, true);
    if (updateJobResponse.success) {
      console.log('✅ Update job successful'.green);
    } else {
      console.log('❌ Update job failed'.red);
    }
  }

  // Switch to job seeker token
  console.log('Switching to job seeker token...'.cyan);
  const jobSeekerLoginAgainResponse = await makeRequest('POST', '/auth/login', {
    email: testJobSeekerUser.email,
    password: testJobSeekerUser.password
  });
  if (jobSeekerLoginAgainResponse.success) {
    token = jobSeekerLoginAgainResponse.token;
    console.log('✅ Job seeker login successful'.green);
  } else {
    console.log('❌ Job seeker login failed'.red);
  }

  // Test application routes
  console.log('\n📝 TESTING APPLICATION ROUTES 📝\n'.magenta.bold);

  // Create application
  if (jobId) {
    console.log('Testing create application endpoint...'.cyan);
    const createApplicationResponse = await makeRequest('POST', `/jobs/${jobId}/applications`, testApplication, true);
    if (createApplicationResponse.success) {
      applicationId = createApplicationResponse.data._id;
      console.log('✅ Create application successful'.green);
    } else {
      console.log('❌ Create application failed'.red);
    }
  }

  // Get applications
  console.log('Testing get applications endpoint...'.cyan);
  const applicationsResponse = await makeRequest('GET', '/applications', null, true);
  if (applicationsResponse.success) {
    console.log('✅ Get applications successful'.green);
  } else {
    console.log('❌ Get applications failed'.red);
  }

  // Get application by ID
  if (applicationId) {
    console.log('Testing get application by ID endpoint...'.cyan);
    const applicationResponse = await makeRequest('GET', `/applications/${applicationId}`, null, true);
    if (applicationResponse.success) {
      console.log('✅ Get application by ID successful'.green);
    } else {
      console.log('❌ Get application by ID failed'.red);
    }
  }

  // Switch back to employer token
  console.log('Switching back to employer token...'.cyan);
  const employerLoginAgainResponse = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  if (employerLoginAgainResponse.success) {
    token = employerLoginAgainResponse.token;
    console.log('✅ Employer login successful'.green);
  } else {
    console.log('❌ Employer login failed'.red);
  }

  // Update application status
  if (applicationId) {
    console.log('Testing update application status endpoint...'.cyan);
    const updateApplicationResponse = await makeRequest('PUT', `/applications/${applicationId}`, {
      status: 'reviewing'
    }, true);
    if (updateApplicationResponse.success) {
      console.log('✅ Update application status successful'.green);
    } else {
      console.log('❌ Update application status failed'.red);
    }
  }

  // Test dashboard routes
  console.log('\n📝 TESTING DASHBOARD ROUTES 📝\n'.magenta.bold);

  // Get employer dashboard
  console.log('Testing get employer dashboard endpoint...'.cyan);
  const employerDashboardResponse = await makeRequest('GET', '/dashboard', null, true);
  if (employerDashboardResponse.success) {
    console.log('✅ Get employer dashboard successful'.green);
  } else {
    console.log('❌ Get employer dashboard failed'.red);
  }

  // Switch to job seeker token
  console.log('Switching to job seeker token...'.cyan);
  const jobSeekerLoginFinalResponse = await makeRequest('POST', '/auth/login', {
    email: testJobSeekerUser.email,
    password: testJobSeekerUser.password
  });
  if (jobSeekerLoginFinalResponse.success) {
    token = jobSeekerLoginFinalResponse.token;
    console.log('✅ Job seeker login successful'.green);
  } else {
    console.log('❌ Job seeker login failed'.red);
  }

  // Get job seeker dashboard
  console.log('Testing get job seeker dashboard endpoint...'.cyan);
  const jobSeekerDashboardResponse = await makeRequest('GET', '/dashboard', null, true);
  if (jobSeekerDashboardResponse.success) {
    console.log('✅ Get job seeker dashboard successful'.green);
  } else {
    console.log('❌ Get job seeker dashboard failed'.red);
  }

  // Test notifications routes
  console.log('\n📝 TESTING NOTIFICATION ROUTES 📝\n'.magenta.bold);

  // Get notifications
  console.log('Testing get notifications endpoint...'.cyan);
  const notificationsResponse = await makeRequest('GET', '/notifications', null, true);
  if (notificationsResponse.success) {
    console.log('✅ Get notifications successful'.green);
  } else {
    console.log('❌ Get notifications failed'.red);
  }

  // Test statistics routes
  console.log('\n📝 TESTING STATISTICS ROUTES 📝\n'.magenta.bold);

  // Get platform stats
  console.log('Testing get platform stats endpoint...'.cyan);
  const platformStatsResponse = await makeRequest('GET', '/stats');
  if (platformStatsResponse.success) {
    console.log('✅ Get platform stats successful'.green);
  } else {
    console.log('❌ Get platform stats failed'.red);
  }

  // Get employer stats
  console.log('Testing get employer stats endpoint...'.cyan);
  const employerStatsResponse = await makeRequest('GET', '/stats/employer', null, true);
  if (employerStatsResponse.success) {
    console.log('✅ Get employer stats successful'.green);
  } else {
    console.log('❌ Get employer stats failed'.red);
  }

  // Test search routes
  console.log('\n📝 TESTING SEARCH ROUTES 📝\n'.magenta.bold);

  // Search
  console.log('Testing search endpoint...'.cyan);
  const searchResponse = await makeRequest('GET', '/search?query=developer');
  if (searchResponse.success) {
    console.log('✅ Search successful'.green);
  } else {
    console.log('❌ Search failed'.red);
  }

  // Search by skills
  console.log('Testing search by skills endpoint...'.cyan);
  const searchBySkillsResponse = await makeRequest('GET', '/search/skills?skills=JavaScript,React');
  if (searchBySkillsResponse.success) {
    console.log('✅ Search by skills successful'.green);
  } else {
    console.log('❌ Search by skills failed'.red);
  }

  console.log('\n🎉 API ROUTE TESTS COMPLETED 🎉\n'.yellow.bold);
};

// Install required packages and run tests
const installAndRunTests = async () => {
  try {
    console.log('Starting API tests...'.cyan);
    await runTests();
  } catch (error) {
    console.error('Error running tests:'.red, error.message);
  }
};

installAndRunTests();
