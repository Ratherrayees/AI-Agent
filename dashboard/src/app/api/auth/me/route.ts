import { NextRequest, NextResponse } from 'next/server';
import { Client, Users } from 'node-appwrite';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('appwrite-user-id')?.value;
    const sessionId = request.cookies.get('appwrite-session-id')?.value;
    const email = request.cookies.get('appwrite-user-email')?.value;
    const name = request.cookies.get('appwrite-user-name')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, user: null, session: null }, { status: 401 });
    }

    // Always attempt admin lookup to get real prefs (including role)
    let user: Record<string, any> = {
      $id: userId,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      name: name || (email ? email.split('@')[0] : 'User'),
      email: email || '',
      phone: '',
      status: true,
      emailVerification: true,
      phoneVerification: false,
      labels: [],
      prefs: {},
      accessedAt: new Date().toISOString(),
    };

    try {
      const apiKey = process.env.APPWRITE_API_KEY;
      if (apiKey) {
        const client = new Client()
          .setEndpoint(APPWRITE_CONFIG.endpoint)
          .setProject(APPWRITE_CONFIG.projectId)
          .setKey(apiKey);
        const users = new Users(client);

        const lookupTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Appwrite lookup timed out')), 4000)
        );

        const freshUser = await Promise.race([users.get(userId), lookupTimeout]).catch(() => null) as Record<string, any> | null;

        if (freshUser) {
          // freshUser wins for all fields — especially prefs.role and labels
          user = {
            ...user,        // fallback defaults
            ...freshUser,   // real Appwrite data overrides everything
            // Ensure cookie-derived name/email are used if Appwrite fields are empty
            name: freshUser.name || user.name,
            email: freshUser.email || user.email,
          };
        }
      }
    } catch (dbErr) {
      // Cookie fallback — user will have no role (prefs: {})
      console.warn('[/api/auth/me] Admin lookup failed, using cookie fallback:', dbErr);
    }

    const session = {
      $id: sessionId || 'session_' + userId,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      userId: userId,
      expire: new Date(Date.now() + 86400000 * 30).toISOString(),
      provider: 'email',
      providerUid: user.email,
      current: true,
    };

    return NextResponse.json({
      success: true,
      user,
      session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, user: null, session: null, error: error.message },
      { status: 401 }
    );
  }
}
