import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_HOST_USER || 'support@optimusassets.live',
    pass: process.env.EMAIL_HOST_PASSWORD || 'Aaasssaaa1@',
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  welcome: {
    subject: 'Welcome to Fidelity Assured!',
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Fidelity Assured!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your account has been created successfully</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to Fidelity Assured! Your account has been created successfully and you're now ready to start earning with our advanced staking and rewards platform.
          </p>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">🎉 What's Next?</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Complete your KYC verification</li>
              <li>Start staking in our high-yield pools</li>
              <li>Earn daily rewards</li>
              <li>Invite friends and earn referral bonuses</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  referralBonus: {
    subject: '🎉 Referral Bonus Earned!',
    html: (name: string, amount: number, referredUser: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Referral Bonus Earned!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Congratulations on your successful referral!</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Great news! You've earned a referral bonus for successfully referring a new user to Fidelity Assured.
          </p>
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">💰 Bonus Amount</h3>
            <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">$${amount.toLocaleString()}</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">📊 Referral Details</h3>
            <p style="color: #666; margin: 0;"><strong>Referred User:</strong> ${referredUser}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Bonus Status:</strong> Available to claim</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard/rewards" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Claim Your Reward
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  depositApproved: {
    subject: '✅ Deposit Approved!',
    html: (name: string, amount: number, reference: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Deposit Approved!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your deposit has been successfully processed</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your deposit has been approved and the funds have been added to your wallet balance.
          </p>
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">💰 Deposit Amount</h3>
            <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">$${amount.toLocaleString()}</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">📋 Transaction Details</h3>
            <p style="color: #666; margin: 0;"><strong>Reference:</strong> ${reference}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Status:</strong> Completed</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Dashboard
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  withdrawalApproved: {
    subject: '✅ Withdrawal Approved!',
    html: (name: string, amount: number, reference: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Withdrawal Approved!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your withdrawal request has been approved</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your withdrawal request has been approved and is being processed. You should receive the funds within 1-3 business days.
          </p>
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">💰 Withdrawal Amount</h3>
            <p style="font-size: 24px; font-weight: bold; color: #28a745; margin: 0;">$${amount.toLocaleString()}</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">📋 Transaction Details</h3>
            <p style="color: #666; margin: 0;"><strong>Reference:</strong> ${reference}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Status:</strong> Approved</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Processing Time:</strong> 1-3 business days</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard/transactions" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Transactions
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  kycApproved: {
    subject: '✅ KYC Verification Approved!',
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ KYC Verification Approved!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your identity verification has been completed</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Congratulations! Your KYC (Know Your Customer) verification has been approved. Your account is now fully verified and you have access to all platform features.
          </p>
          <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #155724; margin: 0 0 10px 0;">🎉 Account Status</h3>
            <p style="font-size: 18px; font-weight: bold; color: #28a745; margin: 0;">Fully Verified</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">✅ What's Unlocked</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Unlimited deposits and withdrawals</li>
              <li>Access to all staking pools</li>
              <li>Higher withdrawal limits</li>
              <li>Priority customer support</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Earning
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  dailyReward: {
    subject: '🎁 Daily Reward Available!',
    html: (name: string, amount: number) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎁 Daily Reward Available!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Don't miss your daily bonus!</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your daily reward is ready to be claimed! Log in to your account to collect your bonus and keep your streak going.
          </p>
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">💰 Daily Reward</h3>
            <p style="font-size: 24px; font-weight: bold; color: #ff6b6b; margin: 0;">$${amount.toLocaleString()}</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">📈 Keep Your Streak</h3>
            <p style="color: #666; margin: 0;">Claim your reward within 24 hours to maintain your daily streak and earn even bigger bonuses!</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard/rewards" 
               style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Claim Reward
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  passwordReset: {
    subject: '🔐 Password Reset Request - Fidelity Assured',
    html: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Reset your Fidelity Assured account password</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your Fidelity Assured account. If you didn't make this request, you can safely ignore this email.
          </p>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">⚠️ Security Notice</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>This link will expire in 1 hour</li>
              <li>Only click the link if you requested this reset</li>
              <li>Never share this link with anyone</li>
              <li>If you didn't request this, your account is secure</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/reset-password" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">🔒 Need Help?</h3>
            <p style="color: #666; margin: 0; font-size: 14px;">
              If you're having trouble with the reset link, you can also copy and paste this URL into your browser:<br>
              <span style="font-family: monospace; color: #333;">${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/reset-password</span>
            </p>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  depositRejected: {
    subject: '❌ Deposit Rejected',
    html: (name: string, amount: number, reference: string, reason: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">❌ Deposit Rejected</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your deposit request has been rejected</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Unfortunately, your deposit request has been rejected by our team. Please review the details below and contact support if you have any questions.
          </p>
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #721c24; margin: 0 0 10px 0;">💰 Deposit Amount</h3>
            <p style="font-size: 24px; font-weight: bold; color: #dc3545; margin: 0;">$${amount.toLocaleString()}</p>
          </div>
          <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin: 0 0 10px 0;">📋 Transaction Details</h3>
            <p style="color: #666; margin: 0;"><strong>Reference:</strong> ${reference}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Status:</strong> Rejected</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Reason:</strong> ${reason}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">🔄 Next Steps</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Review the rejection reason</li>
              <li>Ensure all information is correct</li>
              <li>Contact support if you need assistance</li>
              <li>Submit a new deposit request if needed</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard" 
               style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  withdrawalRejected: {
    subject: '❌ Withdrawal Rejected',
    html: (name: string, amount: number, reference: string, reason: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">❌ Withdrawal Rejected</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your withdrawal request has been rejected</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Unfortunately, your withdrawal request has been rejected by our team. Please review the details below and contact support if you have any questions.
          </p>
          <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 20px; margin: 20px 0; text-align: center;">
            <h3 style="color: #721c24; margin: 0 0 10px 0;">💰 Withdrawal Amount</h3>
            <p style="font-size: 24px; font-weight: bold; color: #dc3545; margin: 0;">$${amount.toLocaleString()}</p>
          </div>
          <div style="background: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin: 0 0 10px 0;">📋 Transaction Details</h3>
            <p style="color: #666; margin: 0;"><strong>Reference:</strong> ${reference}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Status:</strong> Rejected</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Reason:</strong> ${reason}</p>
            <p style="color: #666; margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0 0 10px 0;">🔄 Next Steps</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Review the rejection reason</li>
              <li>Ensure all information is correct</li>
              <li>Contact support if you need assistance</li>
              <li>Submit a new withdrawal request if needed</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/dashboard/transactions" 
               style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Transactions
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
        </div>
      </div>
    `
  },

  adminNotification: {
    withdrawal_request: {
      subject: '💰 New Withdrawal Request - Action Required',
      html: (adminName: string, data: any) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">💰 New Withdrawal Request</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Admin action required</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${adminName}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              A new withdrawal request has been submitted and requires your review and approval.
            </p>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #856404; margin: 0 0 15px 0;">📋 Request Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>User:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.userFullName} (${data.userEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">$${data.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Method:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.method}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Address:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace;">${data.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Reference:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.reference}</td>
                </tr>
              </table>
            </div>
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h3 style="color: #28a745; margin: 0 0 10px 0;">⚡ Quick Actions</h3>
              <p style="color: #666; margin: 0;">Review the request and take appropriate action in the admin panel.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/admin/withdrawals" 
                 style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Review Request
              </a>
            </div>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
          </div>
        </div>
      `
    },

    deposit_request: {
      subject: '💰 New Deposit Request - Action Required',
      html: (adminName: string, data: any) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">💰 New Deposit Request</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Admin action required</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${adminName}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              A new deposit request has been submitted and requires your review and approval.
            </p>
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #155724; margin: 0 0 15px 0;">📋 Request Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>User:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.userFullName} (${data.userEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">$${data.amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Method:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.method}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Transaction Hash:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-family: monospace;">${data.transactionHash}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Reference:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.reference}</td>
                </tr>
              </table>
            </div>
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h3 style="color: #28a745; margin: 0 0 10px 0;">⚡ Quick Actions</h3>
              <p style="color: #666; margin: 0;">Review the request and take appropriate action in the admin panel.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/admin/deposits" 
                 style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Review Request
              </a>
            </div>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
          </div>
        </div>
      `
    },

    kyc_request: {
      subject: '📋 New KYC Request - Action Required',
      html: (adminName: string, data: any) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">📋 New KYC Request</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Admin action required</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${adminName}!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              A new KYC verification request has been submitted and requires your review.
            </p>
            <div style="background: #cce7ff; border: 1px solid #b3d9ff; border-radius: 5px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #004085; margin: 0 0 15px 0;">📋 Request Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>User:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.userFullName} (${data.userEmail})</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Document Type:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.documentType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Submitted:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.submittedAt}</td>
                </tr>
              </table>
            </div>
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
              <h3 style="color: #28a745; margin: 0 0 10px 0;">⚡ Quick Actions</h3>
              <p style="color: #666; margin: 0;">Review the KYC documents and take appropriate action in the admin panel.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/admin/kyc" 
                 style="background: linear-gradient(135deg, #007bff 0%, #6610f2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Review KYC
              </a>
            </div>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 Fidelity Assured. All rights reserved.</p>
          </div>
        </div>
      `
    }
  }
};

// Email service functions
export const emailService = {
  // Send email with template
  async sendEmail(to: string, template: keyof typeof emailTemplates, data: any = {}) {
    try {
      const templateConfig = emailTemplates[template] as any;
      let html: string;
      
      if (typeof templateConfig.html === 'function') {
        // Handle different template function signatures
        if (template === 'referralBonus') {
          html = templateConfig.html(data.name, data.amount, data.referredUser);
        } else if (template === 'depositApproved' || template === 'withdrawalApproved') {
          html = templateConfig.html(data.name, data.amount, data.reference);
        } else if (template === 'depositRejected' || template === 'withdrawalRejected') {
          html = templateConfig.html(data.name, data.amount, data.reference, data.reason);
        } else if (template === 'dailyReward') {
          html = templateConfig.html(data.name, data.amount);
        } else {
          // Default for welcome and kycApproved
          html = templateConfig.html(data.name);
        }
      } else {
        html = templateConfig.html;
      }

      const mailOptions = {
        from: process.env.DEFAULT_FROM_EMAIL || 'support@optimusassets.live',
        to,
        subject: templateConfig.subject,
        html,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error: any) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send welcome email
  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail(email, 'welcome', { name });
  },

  // Send referral bonus email
  async sendReferralBonusEmail(email: string, name: string, amount: number, referredUser: string) {
    return this.sendEmail(email, 'referralBonus', { name, amount, referredUser });
  },

  // Send deposit approved email
  async sendDepositApprovedEmail(email: string, name: string, amount: number, reference: string) {
    return this.sendEmail(email, 'depositApproved', { name, amount, reference });
  },

  // Send withdrawal approved email
  async sendWithdrawalApprovedEmail(email: string, name: string, amount: number, reference: string) {
    return this.sendEmail(email, 'withdrawalApproved', { name, amount, reference });
  },

  // Send deposit rejected email
  async sendDepositRejectedEmail(email: string, name: string, amount: number, reference: string, reason: string) {
    return this.sendEmail(email, 'depositRejected', { name, amount, reference, reason });
  },

  // Send withdrawal rejected email
  async sendWithdrawalRejectedEmail(email: string, name: string, amount: number, reference: string, reason: string) {
    return this.sendEmail(email, 'withdrawalRejected', { name, amount, reference, reason });
  },

  // Send KYC approved email
  async sendKYCApprovedEmail(email: string, name: string) {
    return this.sendEmail(email, 'kycApproved', { name });
  },

  // Send daily reward email
  async sendDailyRewardEmail(email: string, name: string, amount: number) {
    return this.sendEmail(email, 'dailyReward', { name, amount });
  },

  // Send password reset email
  async sendPasswordResetEmail(email: string, name: string) {
    return this.sendEmail(email, 'passwordReset', { name });
  },

  // Send admin notification email
  async sendAdminNotificationEmail(notificationType: string, data: any) {
    try {
      const templateConfig = (emailTemplates.adminNotification as any)[notificationType];
      if (!templateConfig) {
        throw new Error(`Unknown notification type: ${notificationType}`);
      }

      // Get admin emails from environment variables
      const adminEmails = this.getAdminEmails();
      if (adminEmails.length === 0) {
        console.warn('⚠️ No admin emails configured in environment variables');
        return { success: false, error: 'No admin emails configured' };
      }

      const adminName = process.env.ADMIN_NAME || 'Admin';
      const html = templateConfig.html(adminName, data);

      // Send to all admin emails
      const results = [];
      for (const email of adminEmails) {
        const mailOptions = {
          from: process.env.DEFAULT_FROM_EMAIL || 'support@optimusassets.live',
          to: email,
          subject: templateConfig.subject,
          html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Admin notification sent to ${email}:`, result.messageId);
        results.push({ email, messageId: result.messageId });
      }

      return { success: true, results };
    } catch (error: any) {
      console.error('❌ Admin notification email failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get admin emails from environment variables
  getAdminEmails(): string[] {
    const adminEmails: string[] = [];
    
    // Use ADMIN_EMAIL as primary admin email
    if (process.env.ADMIN_EMAIL) {
      adminEmails.push(process.env.ADMIN_EMAIL);
    }
    
    // Remove duplicates
    return [...new Set(adminEmails)];
  },

  // Test email connection
  async testConnection() {
    try {
      await transporter.verify();
      console.log('✅ Email server connection successful');
      return { success: true };
    } catch (error: any) {
      console.error('❌ Email server connection failed:', error);
      return { success: false, error: error.message };
    }
  }
}; 