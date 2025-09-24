const axios = require('axios');

async function testUpload() {
  console.log('Testing DocChain Upload...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    const serverTest = await axios.get('http://localhost:5000/api/ipfs/status');
    console.log('✅ Server is running');
    
    // Test 2: Test authentication endpoints
    console.log('\n2. Testing authentication...');
    
    // Register a test admin user
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    
    console.log('✅ Admin user registered:', registerResponse.data.user.email);
    const token = registerResponse.data.token;
    
    // Test 3: Test upload with authentication
    console.log('\n3. Testing upload with authentication...');
    
    // Create a test file
    const testFile = new Blob(['Test document content'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', testFile, 'test.txt');
    
    const uploadResponse = await axios.post('http://localhost:5000/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Upload successful:', uploadResponse.data.message);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Solution: Make sure you are logged in as an admin user');
    } else if (error.response?.status === 403) {
      console.log('\n💡 Solution: Make sure your user has admin role');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Make sure the backend server is running on port 5000');
    }
  }
}

testUpload();
