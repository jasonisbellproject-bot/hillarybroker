# Cloudinary Setup Guide

## 1. Create a Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard

## 2. Environment Variables

Add these to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## 3. Get Your Cloudinary Credentials

1. Log into your Cloudinary dashboard
2. Go to "Dashboard" → "API Environment variable"
3. Copy the values:
   - **Cloud name**: Found in the URL or dashboard
   - **API Key**: Listed in the API Environment variables
   - **API Secret**: Listed in the API Environment variables

## 4. Test Configuration

Run the test script:

```bash
node scripts/setup-cloudinary.js
```

You should see:
```
☁️ Testing Cloudinary Configuration...
✅ Cloudinary upload successful!
📁 Public ID: mavenguy-test/test-upload
🔗 URL: https://res.cloudinary.com/...
📏 Size: 11 bytes
🧹 Test file cleaned up
```

## 5. Features

Once configured, Cloudinary will be used for:
- ✅ KYC document uploads
- ✅ User avatar uploads
- ✅ Any other file uploads in the app

## 6. Troubleshooting

### Error: "Invalid image file"
- Check that your environment variables are set correctly
- Make sure you're using the correct cloud name

### Error: "Upload failed"
- Verify your API key and secret are correct
- Check that your Cloudinary account is active

### Error: "Environment variables not found"
- Make sure your `.env` file is in the project root
- Restart your development server after adding environment variables 