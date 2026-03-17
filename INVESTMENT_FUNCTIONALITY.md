# Investment Functionality Documentation

## Overview

The investment system in Clearway Capital provides a comprehensive platform for users to invest in various trading plans with different risk levels and returns. The system includes investment plans, real-time tracking, analytics, and automated calculations.

## 🏗️ Architecture

### Database Schema

```sql
-- Investment Plans Table
CREATE TABLE investment_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    min_amount DECIMAL(15,2) NOT NULL,
    max_amount DECIMAL(15,2) NOT NULL,
    daily_return DECIMAL(5,2) NOT NULL,
    duration INTEGER NOT NULL,
    total_return DECIMAL(5,2) NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments Table
CREATE TABLE investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    plan_id INTEGER REFERENCES investment_plans(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    daily_return DECIMAL(15,2) NOT NULL,
    total_return DECIMAL(15,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📊 Investment Plans

### Available Plans

1. **Starter Plan**
   - Investment Range: $100 - $999
   - Daily Return: 2.5%
   - Duration: 30 days
   - Total Return: 175%
   - Risk Level: Low

2. **Professional Plan**
   - Investment Range: $1,000 - $4,999
   - Daily Return: 3.5%
   - Duration: 45 days
   - Total Return: 257.5%
   - Risk Level: Medium

3. **Premium Plan**
   - Investment Range: $5,000 - $19,999
   - Daily Return: 4.5%
   - Duration: 60 days
   - Total Return: 370%
   - Risk Level: High

4. **VIP Plan**
   - Investment Range: $20,000 - $50,000
   - Daily Return: 6.0%
   - Duration: 90 days
   - Total Return: 640%
   - Risk Level: Very High

## 🔧 API Endpoints

### GET /api/dashboard/investments
Fetches user investments and statistics.

**Response:**
```json
{
  "investments": [
    {
      "id": "uuid",
      "amount": 2500,
      "dailyReturn": 87.5,
      "totalReturn": 6437.5,
      "startDate": "2024-01-15T00:00:00Z",
      "endDate": "2024-03-01T00:00:00Z",
      "status": "active",
      "planName": "Professional Plan",
      "progress": 65.5
    }
  ],
  "summary": {
    "totalInvested": 13000,
    "totalEarnings": 2500,
    "activeAmount": 8000,
    "activeCount": 3,
    "completedCount": 2,
    "averageReturn": 3.5
  }
}
```

### POST /api/dashboard/investments
Creates a new investment.

**Request:**
```json
{
  "planId": 2,
  "amount": 2500
}
```

**Response:**
```json
{
  "success": true,
  "investment": {
    "id": "uuid",
    "user_id": "user_uuid",
    "plan_id": 2,
    "amount": 2500,
    "daily_return": 87.5,
    "total_return": 6437.5,
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-03-01T00:00:00Z",
    "status": "active"
  },
  "message": "Investment created successfully"
}
```

## 🎯 Key Features

### 1. Investment Creation
- **Modal Dialog**: User-friendly investment creation interface
- **Real-time Validation**: Amount validation against plan limits
- **Preview Calculations**: Shows expected returns before confirmation
- **Error Handling**: Comprehensive error messages and validation

### 2. Investment Tracking
- **Progress Bars**: Visual progress indicators for each investment
- **Status Tracking**: Active, completed, and cancelled statuses
- **Real-time Updates**: Automatic calculation of earnings and progress
- **Date Management**: Start and end date tracking

### 3. Analytics Dashboard
- **Key Metrics**: Total invested, earnings, ROI, active investments
- **Performance Charts**: Visual representation of investment performance
- **Portfolio Breakdown**: Detailed investment allocation
- **Top Performers**: Highlighting best-performing investments

### 4. Investment Plans
- **Multiple Tiers**: Different risk levels and return rates
- **Flexible Amounts**: Range-based investment amounts
- **Duration Options**: Various investment periods
- **Status Management**: Active, limited, and inactive plans

## 🧮 Calculations

### Daily Return Calculation
```
Daily Return = (Investment Amount × Daily Return Percentage) ÷ 100
```

### Total Return Calculation
```
Total Return = (Investment Amount × Total Return Percentage) ÷ 100
```

### Progress Calculation
```
Progress = ((Current Date - Start Date) ÷ (End Date - Start Date)) × 100
```

### ROI Calculation
```
ROI = (Total Earnings ÷ Total Invested) × 100
```

## 🎨 UI Components

### InvestmentModal
- **Purpose**: Create new investments
- **Features**: 
  - Plan selection
  - Amount validation
  - Real-time calculations
  - Error handling
  - Loading states

### InvestmentAnalytics
- **Purpose**: Display investment statistics
- **Features**:
  - Key metrics cards
  - Performance charts
  - Portfolio breakdown
  - Recent activity

### Investment Plans Grid
- **Purpose**: Display available investment plans
- **Features**:
  - Plan comparison
  - Quick investment buttons
  - Status indicators
  - Investor counts

## 🔒 Security Features

### Authentication
- User session validation
- Secure API endpoints
- Row-level security (RLS)

### Data Validation
- Amount range validation
- Plan existence verification
- User ownership checks

### Error Handling
- Comprehensive error messages
- Graceful failure handling
- User-friendly notifications

## 📱 User Experience

### Investment Flow
1. **Browse Plans**: User views available investment plans
2. **Select Plan**: Choose desired investment plan
3. **Enter Amount**: Input investment amount within plan limits
4. **Preview**: Review calculations and expected returns
5. **Confirm**: Create investment with confirmation
6. **Track**: Monitor investment progress and earnings

### Dashboard Features
- **Overview Cards**: Quick statistics at a glance
- **Active Investments**: Current investment status
- **Investment Plans**: Available options for new investments
- **Analytics**: Detailed performance metrics

## 🚀 Getting Started

### 1. Database Setup
```bash
# Run the database schema
psql -d your_database -f supabase-schema-fixed.sql
```

### 2. Populate Sample Data
```bash
# Run the population script
node scripts/populate-investments.js
```

### 3. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Test the API
```bash
# Test investment plans
node scripts/test-investment-api.js
```

## 🔄 Future Enhancements

### Planned Features
- **Automated Payouts**: Automatic earnings distribution
- **Investment History**: Complete transaction history
- **Advanced Analytics**: Charts and performance metrics
- **Mobile App**: Native mobile application
- **Real-time Updates**: WebSocket integration
- **Investment Strategies**: Portfolio diversification tools

### Technical Improvements
- **Caching**: Redis integration for performance
- **Background Jobs**: Automated calculations
- **Notifications**: Email and push notifications
- **API Rate Limiting**: Protection against abuse
- **Audit Logging**: Complete activity tracking

## 📞 Support

For technical support or questions about the investment functionality, please refer to the API documentation or contact the development team.

---

**Note**: This investment system is designed for educational and demonstration purposes. Real investment platforms require additional regulatory compliance, security measures, and legal considerations. 