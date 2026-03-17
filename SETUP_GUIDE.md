# 🚀 Bitsparetron Setup Guide

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Git

## 🗄️ Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Run Database Schema

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema-enhanced.sql`
4. Execute the script

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Optional: Cloudinary for image uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🛠️ Installation

### 1. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Install Additional Dependencies

```bash
# Install framer-motion for animations
pnpm add framer-motion

# Install recharts for charts
pnpm add recharts

# Install additional UI dependencies
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
```

### 3. Run Development Server

```bash
pnpm dev
```

## 🔧 Configuration

### 1. Supabase Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`

### 2. Email Configuration (Optional)

1. Go to Authentication > Email Templates
2. Customize welcome and confirmation emails
3. Configure SMTP settings if needed

### 3. Storage Configuration (Optional)

1. Go to Storage in your Supabase dashboard
2. Create buckets for:
   - `avatars` - User profile pictures
   - `documents` - KYC documents
   - `screenshots` - Support tickets

## 🎯 Features Overview

### ✅ Implemented Features

1. **Authentication System**
   - Login/Signup with email/password
   - Social login (Google, Apple)
   - Session management
   - Protected routes

2. **Staking System**
   - Multiple staking pools
   - APY calculations
   - Lock periods
   - Progress tracking

3. **Reward System**
   - Daily login bonuses
   - Staking rewards
   - Referral bonuses
   - Achievement rewards
   - Bulk claiming

4. **Referral System**
   - Multi-level referrals
   - Commission tracking
   - Referral codes
   - Bonus distribution

5. **Dashboard**
   - Real-time statistics
   - Quick actions
   - Recent activity
   - Staking overview

### 🚧 In Progress

1. **Withdrawal System**
   - Multiple payment methods
   - Processing status
   - Admin approval

2. **Admin Panel**
   - User management
   - Pool management
   - Analytics dashboard

3. **Advanced Features**
   - KYC verification
   - Two-factor authentication
   - Notifications system

## 📊 Database Tables

### Core Tables

1. **users** - User profiles and balances
2. **staking_pools** - Available staking options
3. **user_stakes** - User staking records
4. **rewards** - All reward transactions
5. **referrals** - Referral relationships
6. **withdrawals** - Withdrawal requests
7. **transactions** - All financial transactions
8. **notifications** - User notifications

### Sample Data

The schema includes sample data for:
- 5 staking pools with different APY rates
- 3 investment plans
- Sample rewards and transactions

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS policies:
- Users can only access their own data
- Admins have full access
- Public read access for active pools

### Authentication

- Supabase Auth integration
- Session management
- Protected API routes
- Middleware protection

## 🎨 Design System

### Glassmorphism Theme

- **Primary**: Black background with glass effects
- **Accent**: Gold/Yellow gradients
- **Staking**: Purple theme
- **Rewards**: Orange theme
- **Success**: Green accents

### Components

- Glass cards with blur effects
- Gradient buttons
- Animated backgrounds
- Responsive design
- Mobile-first approach

## 🚀 Deployment

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 2. Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Database Migration

1. Update Supabase project URL in production
2. Run any additional migrations
3. Test all features

## 🧪 Testing

### 1. Manual Testing

1. **Authentication**
   - Sign up with email
   - Login/logout
   - Password reset
   - Social login

2. **Staking**
   - View staking pools
   - Create stakes
   - Check rewards
   - Monitor progress

3. **Rewards**
   - Daily login bonus
   - Claim individual rewards
   - Bulk claim rewards
   - Check balance updates

4. **Referrals**
   - Generate referral code
   - Sign up with referral
   - Check commission
   - Multi-level tracking

### 2. API Testing

Test all API endpoints:
- `/api/auth/signup`
- `/api/auth/signin`
- `/api/staking/pools`
- `/api/rewards`
- `/api/dashboard/stats`

## 📈 Monitoring

### 1. Supabase Dashboard

- Monitor database performance
- Check authentication logs
- Review error logs
- Track usage metrics

### 2. Application Monitoring

- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement
- Monitor staking activity

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check environment variables
   - Verify Supabase configuration
   - Clear browser cookies

2. **Database Errors**
   - Check RLS policies
   - Verify table structure
   - Check user permissions

3. **Styling Issues**
   - Clear browser cache
   - Check Tailwind configuration
   - Verify CSS imports

### Debug Mode

Enable debug logging:

```env
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

## 📚 Next Steps

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Staking pools
- [x] Reward system
- [x] Dashboard

### Phase 2: Advanced Features 🔄
- [ ] Withdrawal system
- [ ] Admin panel
- [ ] KYC verification
- [ ] Two-factor auth

### Phase 3: Optimization 🚧
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Mobile optimization
- [ ] Analytics integration

### Phase 4: Scale 🚧
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] CDN integration

---

**Status**: Core Features Complete ✅  
**Ready for**: Production Deployment 🚀 