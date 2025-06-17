import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email confirmation using Resend
 * This matches the existing Supabase email template format
 */
export async function sendConfirmationEmail({
  to,
  confirmationUrl,
}: {
  to: string;
  confirmationUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `QueryNotes <notifications@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN || 'mail.querynotes.top'}>`,
      to,
      subject: 'Welcome to QueryNotes!',
      html: `
        <h2>Welcome to QueryNotes!</h2>
        <p>Follow this link to start your intelligent note-taking journey!</p>
        <p><a href="${confirmationUrl}">Confirm your mail</a></p>
      `,
    });
    
    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
}

/**
 * Generic email sending function for future use
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = `QueryNotes <notifications@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN || 'mail.querynotes.top'}>`,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      reply_to: replyTo,
    });
    
    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
}
