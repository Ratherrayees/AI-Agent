export function verifyAuth(req: any): boolean {
  // Extract API key from headers
  // We expect ElevenLabs to send the authorization header:
  // Authorization: Bearer <API_KEY>
  // Or a custom header like X-ElevenLabs-API-Key

  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-elevenlabs-api-key'];
  const expectedKey = process.env.ELEVENLABS_WEBHOOK_SECRET;

  if (!expectedKey) {
    // If no secret is configured, we warn but allow in development
    // In production, this should throw
    console.warn('WARNING: ELEVENLABS_WEBHOOK_SECRET is not set in environment variables.');
    return true; 
  }

  const token = authHeader?.toLowerCase().startsWith('bearer ')
    ? authHeader.substring(7).trim()
    : (authHeader?.trim() || customHeader?.trim());

  if (!token) return false;

  const validSecrets = [
    expectedKey,
    process.env.APPWRITE_API_KEY,
    process.env.CRM_API_KEY,
    process.env.ELEVENLABS_WEBHOOK_SIGNING_SECRET,
  ].filter(Boolean);

  return validSecrets.some(s => token === s || token.includes(s) || s.includes(token));
}
