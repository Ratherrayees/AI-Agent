import { NextRequest } from 'next/server';
import crypto from 'crypto';

export interface WebhookAuthResult {
  authorized: boolean;
  error?: string;
  status?: number;
}

/**
 * Enterprise-Grade Webhook Security & Tool Authentication for ElevenLabs
 * 
 * Protects inbound tool calls (`/api/tools/*`) and webhooks (`/api/webhooks/*`) by enforcing:
 * 1. Constant-time cryptographic comparison (`timingSafeEqual`) to prevent timing side-channel attacks.
 * 2. Fail-Secure policy: Rejects requests immediately if the secret is unconfigured or set to placeholder.
 * 3. Multi-header extraction (`x-api-key`, `xi-api-key`, `authorization: Bearer <key>`).
 * 4. Optional Replay Attack protection: Rejects payloads with timestamps older than 5 minutes.
 * 5. HMAC SHA-256 signature verification for ElevenLabs signed webhooks (`elevenlabs-signature`).
 */
export async function verifyElevenLabsWebhook(request: NextRequest): Promise<WebhookAuthResult> {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;

  // 1. Fail-Secure Check
  if (!secret || secret === 'your_secure_webhook_secret_here' || secret.trim() === '') {
    console.error('[Webhook Security Alert] ELEVENLABS_WEBHOOK_SECRET is not properly configured in environment variables.');
    return {
      authorized: false,
      error: 'Webhook authentication secret is unconfigured on the server.',
      status: 500,
    };
  }

  // 2. Extract Key/Signature from headers
  // ElevenLabs uses `x-api-key` or `xi-api-key` for custom tool headers, and `elevenlabs-signature` for webhook events.
  const apiKeyHeader = request.headers.get('x-api-key') || request.headers.get('xi-api-key');
  const authHeader = request.headers.get('authorization');
  const signatureHeader = request.headers.get('elevenlabs-signature');
  const timestampHeader = request.headers.get('x-timestamp');

  let providedToken = '';

  if (apiKeyHeader) {
    providedToken = apiKeyHeader.trim();
  } else if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    providedToken = authHeader.substring(7).trim();
  }

  // 3. Replay Attack Protection (If timestamp is provided by tool/webhook)
  if (timestampHeader) {
    const timestampMs = Number(timestampHeader) * (timestampHeader.length === 10 ? 1000 : 1);
    if (!isNaN(timestampMs)) {
      const now = Date.now();
      const differenceSeconds = Math.abs(now - timestampMs) / 1000;
      // Reject if request is older or from future by more than 300 seconds (5 minutes)
      if (differenceSeconds > 300) {
        console.warn(`[Webhook Security Alert] Replay attack detected or clock skew too high: ${differenceSeconds}s difference.`);
        return {
          authorized: false,
          error: 'Webhook request timestamp expired or invalid (possible replay attack).',
          status: 401,
        };
      }
    }
  }

  // 4. HMAC SHA-256 Signature Verification (for official ElevenLabs signed webhooks)
  if (signatureHeader && !providedToken) {
    try {
      // Format: t=1690000000,v1=a1b2c3...
      const parts = signatureHeader.split(',');
      const timestampPart = parts.find((p) => p.startsWith('t='));
      const sigPart = parts.find((p) => p.startsWith('v1='));

      if (timestampPart && sigPart) {
        const timestamp = timestampPart.substring(2);
        const signature = sigPart.substring(3);

        // Replay check on signature timestamp
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - Number(timestamp)) > 300) {
          return {
            authorized: false,
            error: 'Webhook signature timestamp expired (possible replay attack).',
            status: 401,
          };
        }

        // Clone and read raw body for HMAC verification
        const clonedReq = request.clone();
        const rawBody = await clonedReq.text();
        const payloadToSign = `${timestamp}.${rawBody}`;

        const expectedSig = crypto
          .createHmac('sha256', secret)
          .update(payloadToSign, 'utf8')
          .digest('hex');

        if (constantTimeEqual(signature, expectedSig)) {
          return { authorized: true };
        } else {
          console.warn('[Webhook Security Alert] HMAC signature mismatch.');
          return {
            authorized: false,
            error: 'Invalid webhook HMAC signature.',
            status: 401,
          };
        }
      }
    } catch (err) {
      console.error('[Webhook Security Alert] Signature parsing failed:', err);
      return { authorized: false, error: 'Invalid signature header format.', status: 400 };
    }
  }

  // 5. Constant-Time API Key Comparison
  if (!providedToken) {
    return {
      authorized: false,
      error: 'Missing required API key (`x-api-key`) or webhook signature header.',
      status: 401,
    };
  }

  if (constantTimeEqual(providedToken, secret)) {
    return { authorized: true };
  } else {
    console.warn('[Webhook Security Alert] Invalid API key token provided.');
    return {
      authorized: false,
      error: 'Unauthorized: Invalid API key token.',
      status: 401,
    };
  }
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  const bufferA = Buffer.from(a, 'utf8');
  const bufferB = Buffer.from(b, 'utf8');

  // If lengths differ, compare bufferA against itself to ensure constant time, but return false
  if (bufferA.length !== bufferB.length) {
    crypto.timingSafeEqual(bufferA, bufferA);
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}
