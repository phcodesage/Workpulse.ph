const axios = require('axios');
const colors = require('colors');

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Helper function to log responses
const logResponse = (endpoint, status, data) => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`ENDPOINT: ${endpoint}`.cyan);
  console.log(`STATUS: ${status === 200 || status === 201 ? status.toString().green : status.toString().red}`);
  console.log('RESPONSE DATA:');
  console.log(JSON.stringify(data, null, 2));
  console.log(`${'='.repeat(50)}\n`);
};

// Test basic routes
const testBasicRoutes = async () => {
  try {
    // Test root endpoint
    console.log('\n🔍 Testing root endpoint...'.yellow);
    try {
      const rootResponse = await axios.get('http://localhost:5000/');
      logResponse('/', rootResponse.status, rootResponse.data);
      console.log('✅ Root endpoint is working'.green);
    } catch (error) {
      console.error('❌ Root endpoint failed:'.red, error.message);
      if (error.code === 'ECONNREFUSED') {
        console.error('Make sure the server is running on port 5000'.red);
        return;
      }
    }

    // Test auth register endpoint
    console.log('\n🔍 Testing auth register endpoint...'.yellow);
    try {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employer'
      };
      
      console.log('Request data:'.cyan, JSON.stringify(registerData, null, 2));
      
      const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      logResponse('/auth/register', registerResponse.status, registerResponse.data);
      console.log('✅ Register endpoint is working'.green);
    } catch (error) {
      console.error('❌ Register endpoint failed:'.red);
      if (error.response) {
        logResponse('/auth/register', error.response.status, error.response.data);
      } else {
        console.error(error.message);
      }
    }

    // Test jobs endpoint
    console.log('\n🔍 Testing jobs endpoint...'.yellow);
    try {
      const jobsResponse = await axios.get(`${API_URL}/jobs`);
      logResponse('/jobs', jobsResponse.status, jobsResponse.data);
      console.log('✅ Jobs endpoint is working'.green);
    } catch (error) {
      console.error('❌ Jobs endpoint failed:'.red);
      if (error.response) {
        logResponse('/jobs', error.response.status, error.response.data);
      } else {
        console.error(error.message);
      }
    }

    // Test profiles endpoint
    console.log('\n🔍 Testing profiles endpoint...'.yellow);
    try {
      const profilesResponse = await axios.get(`${API_URL}/profiles/employers`);
      logResponse('/profiles/employers', profilesResponse.status, profilesResponse.data);
      console.log('✅ Profiles endpoint is working'.green);
    } catch (error) {
      console.error('❌ Profiles endpoint failed:'.red);
      if (error.response) {
        logResponse('/profiles/employers', error.response.status, error.response.data);
      } else {
        console.error(error.message);
      }
    }

    // Test stats endpoint
    console.log('\n🔍 Testing stats endpoint...'.yellow);
    try {
      const statsResponse = await axios.get(`${API_URL}/stats`);
      logResponse('/stats', statsResponse.status, statsResponse.data);
      console.log('✅ Stats endpoint is working'.green);
    } catch (error) {
      console.error('❌ Stats endpoint failed:'.red);
      if (error.response) {
        logResponse('/stats', error.response.status, error.response.data);
      } else {
        console.error(error.message);
      }
    }

    // Test search endpoint
    console.log('\n🔍 Testing search endpoint...'.yellow);
    try {
      const searchResponse = await axios.get(`${API_URL}/search?query=developer`);
      logResponse('/search?query=developer', searchResponse.status, searchResponse.data);
      console.log('✅ Search endpoint is working'.green);
    } catch (error) {
      console.error('❌ Search endpoint failed:'.red);
      if (error.response) {
        logResponse('/search?query=developer', error.response.status, error.response.data);
      } else {
        console.error(error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:'.red, error.message);
  }
};

// Run tests
console.log('\n🚀 STARTING BASIC API ROUTE TESTS 🚀\n'.yellow.bold);
testBasicRoutes().then(() => {
  console.log('\n🎉 BASIC API ROUTE TESTS COMPLETED 🎉\n'.yellow.bold);
});
