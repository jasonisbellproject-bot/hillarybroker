# Dashboard Debugging Guide

## Issue: Dashboard not showing user details after login

### 🔍 Step-by-Step Debugging

#### 1. Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for any error messages
4. Common errors to look for:
   - `401 Unauthorized` - Authentication issues
   - `500 Internal Server Error` - Server-side errors
   - `404 Not Found` - Missing API routes
   - `CORS errors` - Cross-origin issues

#### 2. Check Network Tab
1. In Developer Tools, go to the Network tab
2. Refresh the dashboard page
3. Look for API calls to:
   - `/api/dashboard/stats`
   - `/api/dashboard/transactions`
   - `/api/dashboard/investments`
4. Check the response status and data

#### 3. Verify Login Status
1. Check if you're actually logged in
2. Look for session cookies in Application tab
3. Verify the user session is active

#### 4. Test API Endpoints Manually

**Test with curl (if available):**
```bash
# Test stats endpoint (should return 401 if not logged in)
curl http://localhost:3000/api/dashboard/stats

# Test with authentication (if you have session cookies)
curl -H "Cookie: your-session-cookie" http://localhost:3000/api/dashboard/stats
```

**Test in browser:**
1. Go to: `http://localhost:3000/api/dashboard/stats`
2. Should see JSON response or error message

#### 5. Check Environment Variables
1. Verify `.env.local` file exists
2. Check that Supabase credentials are correct
3. Restart the development server after changes

#### 6. Database Connection
1. Verify Supabase project is active
2. Check if tables exist in your database
3. Verify user data exists in the database

### 🛠️ Quick Fixes

#### Fix 1: Clear Browser Data
1. Clear browser cache and cookies
2. Log out and log back in
3. Check if dashboard shows data

#### Fix 2: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

#### Fix 3: Check User Data
1. Verify user exists in database
2. Check if user has any transactions/investments
3. Create test data if needed

#### Fix 4: Force Refresh
1. Hard refresh the page (Ctrl+Shift+R)
2. Check if data loads
3. Look for any console errors

### 🔧 Common Issues and Solutions

#### Issue 1: "No authenticated user found"
**Cause:** Session not properly established
**Solution:** 
- Clear cookies and log in again
- Check if Supabase session is working

#### Issue 2: "Failed to fetch deposits"
**Cause:** Database table doesn't exist or user has no data
**Solution:**
- Check if `deposits` table exists
- Create test data for the user
- Verify database permissions

#### Issue 3: Dashboard shows loading forever
**Cause:** API calls are failing
**Solution:**
- Check browser console for errors
- Verify API routes are working
- Check network connectivity

#### Issue 4: Dashboard shows fallback UI
**Cause:** Authentication or data fetching issues
**Solution:**
- Check if user is properly authenticated
- Verify API endpoints are responding
- Look for JavaScript errors

### 📊 Expected Behavior

#### When Working Correctly:
1. **Login Page**: Beautiful glassmorphism design
2. **After Login**: Redirect to dashboard
3. **Dashboard**: Shows user stats, transactions, investments
4. **Data Loading**: Skeleton screens then real data
5. **No Errors**: Clean browser console

#### When Not Working:
1. **Dashboard**: Shows fallback UI or loading forever
2. **Console**: Error messages
3. **Network**: Failed API calls
4. **Data**: Missing or incorrect information

### 🎯 Testing Steps

#### Step 1: Basic Login Test
1. Go to `http://localhost:3000/login`
2. Use credentials: `test@example.com` / `password123`
3. Should redirect to dashboard
4. Check if dashboard shows data

#### Step 2: API Test
1. Open browser console
2. Go to dashboard
3. Look for API calls in Network tab
4. Check response status and data

#### Step 3: Data Verification
1. Check if user has data in database
2. Verify API endpoints return correct data
3. Ensure frontend displays data properly

### 📞 Getting Help

If you're still having issues:

1. **Check Console**: Look for specific error messages
2. **Check Network**: See which API calls are failing
3. **Check Database**: Verify user data exists
4. **Check Environment**: Ensure all variables are set

### 🔄 Alternative Solutions

#### Option 1: Use Mock Data
If real data isn't working, the dashboard should fall back to mock data for development.

#### Option 2: Create Test Data
```bash
# Create test user with data
node scripts/create-test-user.js
```

#### Option 3: Reset and Start Fresh
1. Clear all browser data
2. Restart development server
3. Create new user account
4. Test with fresh session

---

**Note:** The dashboard is designed to show fallback data when real data isn't available, so you should always see some information even if the database connection fails. 