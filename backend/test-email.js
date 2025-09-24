require('dotenv').config();
const EmailService = require('./services/emailService');

async function testEmailService() {
  console.log('Testing Email Service...\n');
  
  const emailService = new EmailService();
  
  // Test connection
  console.log('1. Testing email service connection...');
  const connectionTest = await emailService.testConnection();
  if (connectionTest.success) {
    console.log('✅ Email service connection successful\n');
  } else {
    console.log('❌ Email service connection failed:', connectionTest.error);
    console.log('Please check your SMTP configuration in .env file\n');
    return;
  }
  
  // Test upload success email
  console.log('2. Testing upload success email...');
  const uploadTest = await emailService.sendUploadSuccessEmail(
    process.env.TEST_EMAIL || 'test@example.com',
    'test-document.pdf',
    'a1b2c3d4e5f6...',
    'https://ipfs.io/ipfs/QmTest123...'
  );
  
  if (uploadTest.success) {
    console.log('✅ Upload success email sent successfully');
  } else {
    console.log('❌ Upload success email failed:', uploadTest.error);
  }
  
  // Test verification success email
  console.log('\n3. Testing verification success email...');
  const verifySuccessTest = await emailService.sendVerificationSuccessEmail(
    process.env.TEST_EMAIL || 'test@example.com',
    'test-document.pdf',
    'a1b2c3d4e5f6...',
    'https://ipfs.io/ipfs/QmTest123...'
  );
  
  if (verifySuccessTest.success) {
    console.log('✅ Verification success email sent successfully');
  } else {
    console.log('❌ Verification success email failed:', verifySuccessTest.error);
  }
  
  // Test verification failure email
  console.log('\n4. Testing verification failure email...');
  const verifyFailureTest = await emailService.sendVerificationFailureEmail(
    process.env.TEST_EMAIL || 'test@example.com',
    'test-document.pdf',
    'a1b2c3d4e5f6...'
  );
  
  if (verifyFailureTest.success) {
    console.log('✅ Verification failure email sent successfully');
  } else {
    console.log('❌ Verification failure email failed:', verifyFailureTest.error);
  }
  
  console.log('\n📧 Email service test completed!');
  console.log('Check your email inbox for the test emails.');
}

// Run the test
testEmailService().catch(console.error);
