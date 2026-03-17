# Admin User Management System

## Overview



## Features Implemented

### ✅ **Core Functionality**

1. **User Listing & Search**
   - Display all users with pagination
   - Search users by email, first name, or last name
   - Filter by account status (active, suspended, pending)
   - Filter by KYC verification status
   - Real-time statistics overview

2. **User Creation**
   - Create new users with basic information
   - Set user type (regular user or admin)
   - Set initial KYC verification status
   - Automatic temporary password generation
   - Email confirmation enabled by default

3. **User Editing**
   - Edit personal information (name, email)
   - Modify financial data (wallet balance, earnings, deposits, withdrawals)
   - Update account status and permissions
   - Manage referral information
   - Toggle KYC verification and 2FA status

4. **User Actions**
   - **Suspend Users**: Temporarily disable user accounts
   - **Activate Users**: Re-enable suspended accounts
   - **KYC Review**: Approve or reject KYC verification with notes

5. **User Details View**
   - Comprehensive user profile display
   - Financial statistics overview
   - Account status and security settings
   - Activity history

## API Endpoints

### User Management

#### `GET /api/admin/users`
- **Purpose**: Fetch all users with filtering and pagination
- **Parameters**:
  - `search`: Search term for email/name
  - `status`: Filter by account status
  - `page`: Page number for pagination
  - `limit`: Number of users per page
- **Response**: List of users with financial stats

#### `POST /api/admin/users`
- **Purpose**: Create a new user
- **Body**: User creation data
- **Response**: Created user information

#### `POST /api/admin/users/[id]/edit`
- **Purpose**: Update user information
- **Body**: Updated user data
- **Response**: Updated user information

### User Actions

#### `POST /api/admin/users/[id]/suspend`
- **Purpose**: Suspend a user account
- **Response**: Success message

#### `POST /api/admin/users/[id]/activate`
- **Purpose**: Activate a suspended user account
- **Response**: Success message

#### `POST /api/admin/users/[id]/kyc-review`
- **Purpose**: Review and update KYC status
- **Body**: KYC review data (status, notes)
- **Response**: Updated KYC status

## Database Schema

### Users Table
```sql
- id: UUID (Primary Key)
- email: String (Unique)
- first_name: String
- last_name: String
- wallet_balance: Decimal
- total_earned: Decimal
- kyc_verified: Boolean
- two_factor_enabled: Boolean
- is_admin: Boolean
- status: Enum ('active', 'suspended', 'pending')
- referral_code: String
- referred_by: UUID (Foreign Key)
- created_at: Timestamp
- updated_at: Timestamp
```

### Financial Stats Table
```sql
- user_id: UUID (Foreign Key)
- total_deposits: Decimal
- total_withdrawals: Decimal
- total_referral_earnings: Decimal
- referral_count: Integer
- last_calculated_at: Timestamp
```

### KYC Reviews Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- admin_id: UUID (Foreign Key)
- status: Enum ('pending', 'approved', 'rejected')
- notes: Text
- reviewed_at: Timestamp
```

## Security Features

### Admin Authentication
- All admin endpoints require admin privileges
- Admin status verification on each request
- Prevention of self-suspension

### Data Validation
- Input validation for all user data
- Email format verification
- Required field validation
- Status value validation

### Error Handling
- Comprehensive error messages
- Graceful failure handling
- Detailed logging for debugging

## UI Components

### Main User Management Page
- **Location**: `/admin/users`
- **Features**:
  - User table with sortable columns
  - Search and filter controls
  - Statistics overview cards
  - Action buttons for each user

### Modals
1. **User Details Modal**
   - Comprehensive user information display
   - Financial statistics
   - Account status overview

2. **Edit User Modal**
   - Form for editing user information
   - Validation and error handling
   - Real-time updates

3. **Create User Modal**
   - New user creation form
   - User type selection
   - KYC status setting

4. **KYC Review Modal**
   - KYC status selection
   - Admin notes input
   - Review history

## Usage Examples

### Creating a New User
1. Click "Add User" button
2. Fill in required information:
   - First Name
   - Last Name
   - Email Address
   - User Type (Regular/Admin)
   - KYC Status
3. Click "Create User"
4. User receives temporary password: `TemporaryPassword123!`

### Suspending a User
1. Find user in the user list
2. Click the suspend button (ban icon)
3. Confirm the action
4. User status changes to "suspended"

### Reviewing KYC
1. Click "Review KYC" from user details
2. Select status: Pending/Approved/Rejected
3. Add admin notes if needed
4. Click "Update Status"

## Testing

### Manual Testing
1. Navigate to `/admin/users`
2. Test all CRUD operations
3. Verify search and filter functionality
4. Test user actions (suspend/activate)
5. Test KYC review process

### Automated Testing
Run the test script:
```bash
node scripts/test-admin-user-management.js
```

## Future Enhancements

### Planned Features
1. **Bulk Operations**: Select multiple users for batch actions
2. **User Activity Logs**: Track user actions and changes
3. **Advanced Filtering**: Filter by date ranges, financial thresholds
4. **Export Functionality**: Export user data to CSV/Excel
5. **Email Notifications**: Notify users of status changes
6. **Audit Trail**: Track all admin actions for compliance

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live updates
2. **Advanced Search**: Full-text search with multiple criteria
3. **Performance Optimization**: Pagination and lazy loading
4. **Mobile Responsiveness**: Enhanced mobile interface

## Troubleshooting

### Common Issues

1. **User Not Found**
   - Verify user ID is correct
   - Check if user exists in database

2. **Permission Denied**
   - Ensure admin privileges are set
   - Verify admin user ID is correct

3. **KYC Review Fails**
   - Check if KYC reviews table exists
   - Verify user exists before review

4. **User Creation Fails**
   - Check email uniqueness
   - Verify all required fields are provided

### Debug Mode
Enable detailed logging by checking browser console and server logs for error messages and debugging information.

## Support

For technical support or feature requests, please refer to the development team or create an issue in the project repository.
