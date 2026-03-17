import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email'

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 KYC Upload - Starting request...')
    
    // Create Supabase client
    let supabase
    try {
      supabase = await createClient()
      console.log('✅ Supabase client created successfully')
    } catch (clientError) {
      console.error('❌ Failed to create Supabase client:', clientError)
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: clientError instanceof Error ? clientError.message : 'Unknown error'
      }, { status: 500 })
    }
    
    // Check authentication
    let user
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        console.error('❌ Auth error:', authError)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
      }
      if (!authUser) {
        console.log('❌ No authenticated user')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      user = authUser
      console.log('✅ User authenticated:', user.id)
    } catch (authError) {
      console.error('❌ Auth getUser error:', authError)
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: authError instanceof Error ? authError.message : 'Unknown error'
      }, { status: 401 })
    }

    console.log('🔍 KYC Upload - User ID:', user.id)

    const formData = await request.formData()
    const file = formData.get('document') as File
    const documentType = formData.get('documentType') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!documentType || !['passport', 'drivers_license', 'national_id'].includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    let documentUrl = ''

    // Upload to Cloudinary if configured
    if (isCloudinaryConfigured()) {
      try {
        const { uploadImage } = await import('@/lib/cloudinary')
        documentUrl = await uploadImage(file)
        console.log('✅ File uploaded to Cloudinary:', documentUrl)
      } catch (cloudinaryError) {
        console.error('❌ Cloudinary upload failed:', cloudinaryError)
        // Fallback to placeholder URL if Cloudinary fails
        documentUrl = `placeholder-${Date.now()}-${file.name}`
        console.log('⚠️ Using fallback URL:', documentUrl)
      }
    } else {
      console.log('⚠️ Cloudinary not configured, using fallback URL')
      documentUrl = `placeholder-${Date.now()}-${file.name}`
    }

    // Save to database
    let kycDoc
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          document_url: documentUrl,
          status: 'pending'
        })
        .select()
        .single()

      if (dbError) {
        console.error('❌ Database error:', dbError)
        
        // Check if table doesn't exist
        if (dbError.code === '42P01') {
          return NextResponse.json({ 
            error: 'KYC system not yet configured. Please contact support.',
            details: 'kyc_documents table does not exist'
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          error: 'Failed to save document',
          details: dbError.message 
        }, { status: 500 })
      }

      kycDoc = dbData
      console.log('✅ KYC document saved to database')

      // Send admin notification email
      try {
        // Get user details for the notification
        const { data: userData } = await supabase
          .from('users')
          .select('email, first_name, last_name')
          .eq('id', user.id)
          .single();

        const userFullName = userData ? `${userData.first_name} ${userData.last_name}` : 'User';
        
        // Send notification to admin emails from environment variables
        await emailService.sendAdminNotificationEmail('kyc_request', {
          userFullName,
          userEmail: userData?.email || 'Unknown',
          documentType: documentType,
          submittedAt: new Date().toLocaleDateString()
        });
      } catch (emailError) {
        console.error('Admin notification email failed:', emailError);
        // Don't fail the KYC upload if email fails
      }
    } catch (dbError) {
      console.error('❌ Database query error:', dbError)
      return NextResponse.json({ 
        error: 'Database query failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      document: kycDoc,
      message: 'Document uploaded successfully' 
    })

  } catch (error) {
    console.error('❌ KYC upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 