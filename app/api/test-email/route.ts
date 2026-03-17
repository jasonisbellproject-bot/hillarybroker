import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, template, data } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Test email connection first
    const connectionTest = await emailService.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({ 
        error: 'Email server connection failed', 
        details: connectionTest.error 
      }, { status: 500 });
    }

    // Send test email
    let result;
    if (template === 'adminNotification') {
      result = await emailService.sendAdminNotificationEmail(data.notificationType || 'withdrawal_request', data);
    } else {
      result = await emailService.sendEmail(email, template || 'welcome', data || { name: 'Test User' });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({
        error: 'Failed to send test email',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Test email connection
    const result = await emailService.testConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email server connection successful'
      });
    } else {
      return NextResponse.json({
        error: 'Email server connection failed',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Email connection test error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 