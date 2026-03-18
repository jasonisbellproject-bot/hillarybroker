# Fidelity Assured Investment Platform

A modern investment platform built with Next.js, Supabase, and Tailwind CSS.

## Features

- **User Authentication**: Secure signup/signin with Supabase Auth
- **User Dashboard**: Personal investment tracking and statistics
- **Admin Dashboard**: Platform-wide analytics and user management
- **Investment Management**: Deposit, withdraw, and track investments
- **KYC Verification**: Document upload and verification system
- **Real-time Data**: Live dashboard statistics from database
- **Responsive Design**: Mobile-friendly interface

## Database Schema

The platform uses the following main tables:
- `users`: User profiles and authentication data
- `deposits`: User deposit transactions
- `withdrawals`: User withdrawal transactions
- `investments`: User investment records
- `investment_plans`: Available investment plans
- `kyc_documents`: KYC verification documents

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mavenguy
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Fill in your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up the database:
```bash
# Run the SQL schema in your Supabase SQL editor
# Copy the contents of supabase-schema.sql
```

5. Populate sample data (optional):
```bash
node scripts/populate-sample-data.js
```

6. Start the development server:
```bash
pnpm dev
```

## Dashboard Features

### User Dashboard
- **Real-time Statistics**: Total deposits, withdrawals, active investments, and earnings
- **KYC Status**: Verification status and requirements
- **2FA Status**: Two-factor authentication status
- **Balance Alerts**: Low balance warnings
- **Profile Information**: User details and account status

### Admin Dashboard
- **Platform Analytics**: Total users, deposits, investments, and revenue
- **Recent Activities**: Live feed of user transactions and activities
- **System Alerts**: Platform notifications and warnings
- **Quick Actions**: Direct links to user management and reviews

## API Endpoints

### User Dashboard
- `GET /api/dashboard/stats?userId={id}` - Fetch user statistics

### Admin Dashboard
- `GET /api/admin/stats` - Fetch platform-wide statistics
- `GET /api/admin/activities` - Fetch recent platform activities

## Database Population

To populate the database with sample data for testing:

1. Ensure your environment variables are set up correctly
2. Run the sample data script:
```bash
node scripts/populate-sample-data.js
```

This will create:
- 5 sample users (including 1 admin)
- Sample deposits and withdrawals
- Sample investments
- Sample KYC documents

## Development

### Project Structure
```
mavenguy/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── dashboard/         # User dashboard pages
│   ├── api/               # API routes
│   └── ...
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── hooks/                 # Custom React hooks
└── scripts/               # Database scripts
```

### Key Technologies
- **Next.js 14**: React framework with app router
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Lucide React**: Icon library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 