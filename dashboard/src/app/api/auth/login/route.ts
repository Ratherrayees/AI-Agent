import { NextRequest, NextResponse } from 'next/server';
import { Client, Users } from 'node-appwrite';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';

const APPWRITE_ADMIN_KEY = process.env.APPWRITE_API_KEY || 'standard_6f8e5d9ca74e5146446b1048dee88742750c566de14c5b5275009881b50da8169c51f00411e5173c85e32c2c61089156963ea6630ad95cb550d108128bc7c9a72cb4b83a02309bf668b67996d87061b7e657e4e52db39c24a80a77156f04eb3fdc4b7817688527628c54a8207f68b1eccee54a85833ac5750adb99188ab866fd';

export async function POST(request: NextRequest) {
  let isFormSubmit = false;
  let email = '';
  let password = '';

  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      email = formData.get('email')?.toString() || '';
      password = formData.get('password')?.toString() || '';
      isFormSubmit = true;
    } else {
      const body = await request.json();
      email = body.email;
      password = body.password;
    }

    if (!email || !password) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL('/login?error=Email+and+password+are+required', request.url), 303);
      }
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // 1. Verify user credentials using pure REST call to Appwrite Cloud (bypassing node SDK header restrictions)
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${APPWRITE_CONFIG.endpoint}/account/sessions/email`, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': APPWRITE_CONFIG.projectId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    }).finally(() => clearTimeout(fetchTimeout));

    const sessionData = await res.json();

    if (!res.ok || !sessionData.$id) {
      if (isFormSubmit) {
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(sessionData.message || 'Invalid email or password')}&email=${encodeURIComponent(email)}`, request.url), 303);
      }
      return NextResponse.json(
        { success: false, error: sessionData.message || 'Invalid email or password' },
        { status: res.status || 401 }
      );
    }

    const userId = sessionData.userId;

    // 2. Fetch user profile using admin Users SDK to guarantee accurate name, prefs & labels
    let user: Record<string, any> = {
      $id: userId,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      name: email.split('@')[0],
      email: email,
      phone: '',
      status: true,
      emailVerification: true,
      phoneVerification: false,
      labels: [],
      prefs: {},
      accessedAt: new Date().toISOString()
    };

    try {
      const adminClient = new Client()
        .setEndpoint(APPWRITE_CONFIG.endpoint)
        .setProject(APPWRITE_CONFIG.projectId)
        .setKey(APPWRITE_ADMIN_KEY);

      const users = new Users(adminClient);
      const lookupTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Appwrite lookup timed out')), 4000)
      );
      const freshUser = await Promise.race([users.get(userId), lookupTimeout]).catch(
        () => null
      ) as Record<string, any> | null;
      if (freshUser) {
        // freshUser wins — it has real prefs.role, labels, etc.
        user = { ...user, ...freshUser, name: freshUser.name || user.name };
      }
    } catch (dbErr) {
      console.warn('Admin user lookup fallback note:', dbErr);
    }

    const cookieOptions = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    };

    if (isFormSubmit) {
      const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url), 303);
      redirectResponse.cookies.set('appwrite-user-id', user.$id, cookieOptions);
      redirectResponse.cookies.set('appwrite-session-id', sessionData.$id, cookieOptions);
      redirectResponse.cookies.set('appwrite-user-email', user.email, cookieOptions);
      redirectResponse.cookies.set('appwrite-user-name', user.name || user.email.split('@')[0], cookieOptions);
      return redirectResponse;
    }

    const response = NextResponse.json({
      success: true,
      user,
      session: sessionData,
      message: 'Login successful'
    });

    // Store verified user profile and session ID inside cookies for instantaneous localhost checkAuth
    response.cookies.set('appwrite-user-id', user.$id, cookieOptions);
    response.cookies.set('appwrite-session-id', sessionData.$id, cookieOptions);
    response.cookies.set('appwrite-user-email', user.email, cookieOptions);
    response.cookies.set('appwrite-user-name', user.name || user.email.split('@')[0], cookieOptions);

    return response;
  } catch (error: any) {
    console.error('Server login error:', error);
    if (isFormSubmit) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message || 'Invalid credentials')}&email=${encodeURIComponent(email)}`, request.url), 303);
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid credentials' },
      { status: error.code || 401 }
    );
  }
}
