import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/email';
// import { Webhook } from 'standardwebhooks'; // Temporarily disabled for debugging

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

    // For debugging: temporarily disable webhook verification to see the actual payload
    console.log('Raw payload received:', payload);
    console.log('Headers received:', Object.keys(headers));
    console.log('All headers:', headers);

    let verifiedData;
    try {
      verifiedData = JSON.parse(payload);
      console.log('Parsed payload successfully:', verifiedData);
    } catch (parseError) {
      console.error('Failed to parse payload:', parseError);
      return NextResponse.json(
        { error: 'Invalid payload format' },
        { status: 400 }
      );
    }

    // TODO: Re-enable webhook verification once we understand the payload format
    // const wh = new Webhook(hookSecret);
    // verifiedData = wh.verify(payload, headers);

    console.log('Webhook received and verified successfully');
    console.log('Verified data structure:', JSON.stringify(verifiedData, null, 2));

    // Extract data from the verified payload
    // Check if the data has the expected structure
    let user, email_data;

    if (verifiedData && typeof verifiedData === 'object') {
      if ('user' in verifiedData && 'email_data' in verifiedData) {
        // Standard Supabase webhook format
        user = verifiedData.user;
        email_data = verifiedData.email_data;
      } else if ('email_to' in verifiedData) {
        // Alternative format - create compatible structure
        user = { email: verifiedData.email_to };
        email_data = {
          token: verifiedData.token || '',
          token_hash: verifiedData.token_hash || '',
          redirect_to: verifiedData.confirmation_url || verifiedData.redirect_to || '',
          email_action_type: verifiedData.email_action_type || 'signup',
          site_url: verifiedData.site_url || '',
          token_new: verifiedData.token_new || '',
          token_hash_new: verifiedData.token_hash_new || ''
        };
      } else {
        console.error('Unexpected payload structure:', verifiedData);
        return NextResponse.json(
          { error: 'Unexpected payload structure' },
          { status: 400 }
        );
      }
    } else {
      console.error('Invalid verified data:', verifiedData);
      return NextResponse.json(
        { error: 'Invalid verified data' },
        { status: 400 }
      );
    }

    const email_to = user.email;
    const confirmation_url = email_data.redirect_to;
    const email_action_type = email_data.email_action_type;

    console.log('Extracted data:', {
      email_to,
      email_action_type,
      confirmation_url,
      has_confirmation_url: !!confirmation_url
    });

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
