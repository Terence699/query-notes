import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Webhook received:', { email_action_type: body.email_action_type, email_to: body.email_to });

    // Supabase sends the email data in this format
    const {
      email_to,
      confirmation_url,
      email_action_type
    } = body;

    if (!email_to || !confirmation_url) {
      console.error('Missing required fields:', { email_to: !!email_to, confirmation_url: !!confirmation_url });
      return NextResponse.json(
        { error: 'Missing required fields: email_to and confirmation_url' },
        { status: 400 }
      );
    }

    // Only handle signup confirmation emails for now
    if (email_action_type !== 'signup') {
      console.log(`Skipping email type: ${email_action_type}`);
      return NextResponse.json({
        success: true,
        message: `Email type ${email_action_type} not handled by custom hook`
      });
    }

    console.log(`Sending signup email to ${email_to}`);

    // Send the confirmation email using Resend
    const result = await sendConfirmationEmail({
      to: email_to,
      confirmationUrl: confirmation_url,
    });

    if (!result.success) {
      console.error('Failed to send email via Resend:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }

    console.log('Email sent successfully via Resend');
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Email webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
