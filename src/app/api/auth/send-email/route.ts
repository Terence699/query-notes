import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';
import { Webhook } from 'standardwebhooks';

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!process.env.SEND_EMAIL_HOOK_SECRET) {
      console.error('SEND_EMAIL_HOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get the raw payload for webhook verification
    const payload = await request.text();
    const headers = Object.fromEntries(request.headers);

    // Extract the webhook secret
    // Supabase stores the secret as a raw hex string, but standardwebhooks expects base64
    // If the secret starts with 'v1,whsec_', it's already in the correct format
    // Otherwise, it's a raw hex string from Supabase that needs to be converted
    let hookSecret = process.env.SEND_EMAIL_HOOK_SECRET;
    if (hookSecret.startsWith('v1,whsec_')) {
      hookSecret = hookSecret.replace('v1,whsec_', '');
    } else {
      // Convert hex string to base64 for standardwebhooks
      const hexBuffer = Buffer.from(hookSecret, 'hex');
      hookSecret = hexBuffer.toString('base64');
    }

    // Verify the webhook payload
    const wh = new Webhook(hookSecret);
    let verifiedData;

    try {
      verifiedData = wh.verify(payload, headers);
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    console.log('Webhook received and verified successfully');

    // Extract data from the verified payload
    // Supabase sends the email data in this format
    const {
      user,
      email_data
    } = verifiedData as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
        token_new: string;
        token_hash_new: string;
      };
    };

    const email_to = user.email;
    const confirmation_url = email_data.redirect_to;
    const email_action_type = email_data.email_action_type;

    console.log('Extracted data:', { email_to, email_action_type, has_confirmation_url: !!confirmation_url });

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
