const cloudinary = require('cloudinary').v2
require('dotenv').config({ path: '.env' })

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function testCloudinary() {
  try {
    console.log('☁️ Testing Cloudinary Configuration...')
    
    // Test upload with a simple text file
    const result = await cloudinary.uploader.upload(
      'data:text/plain;base64,SGVsbG8gV29ybGQ=', // "Hello World" in base64
      {
        public_id: 'test-upload',
        folder: 'mavenguy-test'
      }
    )
    
    console.log('✅ Cloudinary upload successful!')
    console.log(`📁 Public ID: ${result.public_id}`)
    console.log(`🔗 URL: ${result.secure_url}`)
    console.log(`📏 Size: ${result.bytes} bytes`)
    
    // Clean up test file
    await cloudinary.uploader.destroy('mavenguy-test/test-upload')
    console.log('🧹 Test file cleaned up')
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error.message)
    console.log('\n📝 Make sure you have these environment variables:')
    console.log('- CLOUDINARY_CLOUD_NAME')
    console.log('- CLOUDINARY_API_KEY') 
    console.log('- CLOUDINARY_API_SECRET')
  }
}

testCloudinary() 