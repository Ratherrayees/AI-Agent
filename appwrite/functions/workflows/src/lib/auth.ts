export function verifyWorkflowAuth(req: any): boolean {
  // Check secret token or Appwrite internal invocation header
  const authHeader = req.headers['authorization'];
  const customHeader = req.headers['x-workflows-api-key'];
  const expectedKey = process.env.WORKFLOWS_API_SECRET || process.env.APPWRITE_API_KEY;

  if (!expectedKey) {
    console.warn('WARNING: WORKFLOWS_API_SECRET not set, allowing invocation.');
    return true;
  }

  const token = authHeader?.replace('Bearer ', '') || customHeader;
  return token === expectedKey;
}
