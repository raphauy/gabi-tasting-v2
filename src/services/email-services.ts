import { Resend } from 'resend';
import OtpEmail from '@/components/email/otp-email';
import InviteEmail from '@/components/email/invite-email';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export async function sendOTP(email: string, code: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      replyTo: 'gabi@gabizimmer.com',
      subject: 'Código de verificación para Gabi Tasting',
      react: OtpEmail({ code }),
    });

    const error = result.error;

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    } else {
      console.log('Email sent successfully:', result.data);
      return { success: true, data: result.data };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendWineryUserInvite(email: string, inviterName: string, invitedName: string, wineryName: string, tastingName: string, ctaLink: string) {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      replyTo: 'gabi@gabizimmer.com',
      subject: 'Invitación a Gabi Tasting',
      react: InviteEmail({ inviterName, invitedName, wineryName, tastingName, ctaLink }),
    });

    const error = result.error;

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    } else {
      console.log('Email sent successfully:', result.data);
      return { success: true, data: result.data };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

