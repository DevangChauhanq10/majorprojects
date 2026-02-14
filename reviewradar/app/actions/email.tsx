'use server';

import { resend } from "@/lib/resend";
import FeedbackConfirmation from "@/components/emails/feedback-confirmation";
import WeeklyDigest from "@/components/emails/weekly-digest";
import CriticalAlert from "@/components/emails/critical-alert";
import { render } from "@react-email/render";

// Helper to determine from address
// In production, this should be a verified domain like 'notifications@reviewradar.com'
// For testing/development without a domain, Resend requires 'onboarding@resend.dev'
const FROM_EMAIL = process.env.NODE_ENV === 'production' 
  ? 'ReviewRadar <notifications@reviewradar.com>' 
  : 'ReviewRadar <onboarding@resend.dev>';

// Admin email for alerts - in a real app this might come from a DB or env var
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'; 

export async function sendFeedbackConfirmation(
  userEmail: string, 
  userFirstname: string,
  feedbackTitle: string,
  feedbackCategory: string
) {
  try {
    const emailHtml = await render(
        <FeedbackConfirmation 
          userFirstname={userFirstname}
          feedbackTitle={feedbackTitle} 
          feedbackCategory={feedbackCategory}
        />
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: userEmail,
      subject: 'We received your feedback - ReviewRadar',
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending feedback confirmation:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending feedback confirmation:", error);
    return { success: false, error };
  }
}

export async function sendWeeklyDigest(
  analystEmail: string,
  stats: { total: number; topCategory: string; avgRating: string }
) {
  try {
    const emailHtml = await render(
      <WeeklyDigest 
        totalFeedback={stats.total}
        topCategory={stats.topCategory}
        averageRating={stats.avgRating}
      />
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: analystEmail,
      subject: 'ReviewRadar Weekly Digest',
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending weekly digest:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending weekly digest:", error);
    return { success: false, error };
  }
}

export async function sendCriticalAlert(
  recentExampleCount: number
) {
  try {
    const emailHtml = await render(
      <CriticalAlert recentFeedbackCount={recentExampleCount} />
    );

    // In a real app you might fan this out to multiple admins
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL, 
      subject: '⚠️ Critical Alert: Negative Feedback Spike',
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending critical alert:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Exception sending critical alert:", error);
    return { success: false, error };
  }
}
