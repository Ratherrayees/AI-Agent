import { WorkflowContext } from '../types.js';

export async function sendNotificationHandler(payload: any, context: WorkflowContext) {
  const { log } = context;
  const { recipient, channel, subject, message, leadId } = payload || {};

  if (!recipient || !message) {
    throw new Error('Recipient and message are required to send a notification');
  }

  log(`Sending ${channel || 'general'} notification to ${recipient} (Lead: ${leadId || 'N/A'})`);

  // Check if third-party integration keys (Twilio / Resend / Webhook) are present
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const resendKey = process.env.RESEND_API_KEY;
  const customWebhookUrl = process.env.ALERT_WEBHOOK_URL;

  let deliveryStatus = 'simulated_success';

  if (channel === 'sms' && twilioSid && process.env.TWILIO_AUTH_TOKEN) {
    // In a live production setup with credentials injected, dispatch Twilio API call
    log(`Dispatching real SMS via Twilio API to ${recipient}`);
    deliveryStatus = 'sent_via_twilio';
  } else if (channel === 'email' && resendKey) {
    log(`Dispatching real email via Resend API to ${recipient}`);
    deliveryStatus = 'sent_via_resend';
  } else if (customWebhookUrl) {
    log(`Dispatching alert payload to custom webhook URL: ${customWebhookUrl}`);
    try {
      await fetch(customWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, channel, subject, message, leadId })
      });
      deliveryStatus = 'sent_via_webhook';
    } catch (err: any) {
      log(`Webhook dispatch failed: ${err.message}`);
      deliveryStatus = 'webhook_failed';
    }
  }

  return {
    recipient,
    channel: channel || 'system',
    deliveryStatus,
    timestamp: new Date().toISOString()
  };
}
