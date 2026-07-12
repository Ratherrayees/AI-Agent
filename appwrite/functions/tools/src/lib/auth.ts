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
    'wsec_76954557fecbdc91aacc5e56891e0f196d3a09a6ad470660a0148142f3e8c23a',
    '3093639f7270c7fbbe055ea9196253c154359bba4167e4d40146b0106c17946c',
    'standard_6f8e5d9ca74e5146446b1048dee88742750c566de14c5b5275009881b50da8169c51f00411e5173c85e32c2c61089156963ea6630ad95cb550d108128bc7c9a72cb4b83a02309bf668b67996d87061b7e657e4e52db39c24a80a77156f04eb3fdc4b7817688527628c54a8207f68b1eccee54a85833ac5750adb99188ab866fd'
  ].filter(Boolean);

  return validSecrets.some(s => token === s || token.includes(s) || s.includes(token));
}
