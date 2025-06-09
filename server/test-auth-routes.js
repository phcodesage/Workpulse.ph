const axios = require('axios');
const colors = require('colors');

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Store auth token
let token = '';

// Test user data
const testUser = {
  name: 'Test Auth User',
  email: 'testauth@example.com',
  password: 'password123',
  role: 'employer'
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

// Test authentication routes
const testAuthRoutes = async () => {
  try {
    // Test register endpoint
    console.log('\n🔍 Testing register endpoint...'.yellow);
    try {
      console.log('Request data:'.cyan, JSON.stringify(testUser, null, 2));
      
      const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      logResponse('/auth/register', registerResponse.status, registerResponse.data);
      console.log('✅ Register endpoint is working'.green);
      
      if (registerResponse.data.token) {
        token = registerResponse.data.token;
        console.log('Token received:'.green, token.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('❌ Register endpoint failed:'.red);
      if (error.response) {
        logResponse('/auth/register', error.response.status, error.response.data);
        
        // If user already exists, try logging in
        if (error.response.data.error === 'User already exists') {
          console.log('User already exists, trying login...'.yellow);
          await testLogin();
        }
      } else {
        console.error(error.message);
      }
    }
    
    // Test protected routes if we have a token
    if (token) {
      await testProtectedRoutes();
    } else {
      console.log('❌ No authentication token available, skipping protected routes'.red);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:'.red, error.message);
  }
};

// Test login
const testLogin = async () => {
  try {
    console.log('\n🔍 Testing login endpoint...'.yellow);
    const loginData = {
      email: testUser.email,
      password: testUser.password
    };
    
    console.log('Request data:'.cyan, JSON.stringify(loginData, null, 2));
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    logResponse('/auth/login', loginResponse.status, loginResponse.data);
    console.log('✅ Login endpoint is working'.green);
    
    if (loginResponse.data.token) {
      token = loginResponse.data.token;
      console.log('Token received:'.green, token.substring(0, 20) + '...');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Login endpoint failed:'.red);
    if (error.response) {
      logResponse('/auth/login', error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

// Test protected routes
const testProtectedRoutes = async () => {
  // Test get current user endpoint
  console.log('\n🔍 Testing get current user endpoint...'.yellow);
  try {
    const meResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResponse('/auth/me', meResponse.status, meResponse.data);
    console.log('✅ Get current user endpoint is working'.green);
  } catch (error) {
    console.error('❌ Get current user endpoint failed:'.red);
    if (error.response) {
      logResponse('/auth/me', error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
  
  // Test dashboard endpoint
  console.log('\n🔍 Testing dashboard endpoint...'.yellow);
  try {
    const dashboardResponse = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResponse('/dashboard', dashboardResponse.status, dashboardResponse.data);
    console.log('✅ Dashboard endpoint is working'.green);
  } catch (error) {
    console.error('❌ Dashboard endpoint failed:'.red);
    if (error.response) {
      logResponse('/dashboard', error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
  
  // Test notifications endpoint
  console.log('\n🔍 Testing notifications endpoint...'.yellow);
  try {
    const notificationsResponse = await axios.get(`${API_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResponse('/notifications', notificationsResponse.status, notificationsResponse.data);
    console.log('✅ Notifications endpoint is working'.green);
  } catch (error) {
    console.error('❌ Notifications endpoint failed:'.red);
    if (error.response) {
      logResponse('/notifications', error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
  
  // Test employer stats endpoint
  console.log('\n🔍 Testing employer stats endpoint...'.yellow);
  try {
    const statsResponse = await axios.get(`${API_URL}/stats/employer`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    logResponse('/stats/employer', statsResponse.status, statsResponse.data);
    console.log('✅ Employer stats endpoint is working'.green);
  } catch (error) {
    console.error('❌ Employer stats endpoint failed:'.red);
    if (error.response) {
      logResponse('/stats/employer', error.response.status, error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

// Run tests
console.log('\n🚀 STARTING AUTHENTICATION API ROUTE TESTS 🚀\n'.yellow.bold);
testAuthRoutes().then(() => {
  console.log('\n🎉 AUTHENTICATION API ROUTE TESTS COMPLETED 🎉\n'.yellow.bold);
});
