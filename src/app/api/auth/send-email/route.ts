import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Supabase sends the email data in this format
    const {
      email_to,
      confirmation_url,
      email_action_type
    } = body;

    if (!email_to || !confirmation_url) {
      return NextResponse.json(
        { error: 'Missing required fields: email_to and confirmation_url' },
        { status: 400 }
      );
    }

    // Only handle signup confirmation emails for now
    if (email_action_type !== 'signup') {
      return NextResponse.json({
        success: true,
        message: `Email type ${email_action_type} not handled by custom hook`
      });
    }

    // Send the confirmation email using Resend
    const result = await sendConfirmationEmail({
      to: email_to,
      confirmationUrl: confirmation_url,
    });

    if (!result.success) {
      console.error('Failed to send email via Resend:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Email webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
