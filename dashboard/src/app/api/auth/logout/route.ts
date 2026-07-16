import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('appwrite-session');
  response.cookies.delete('appwrite-user-id');
  response.cookies.delete('appwrite-session-id');
  response.cookies.delete('appwrite-user-email');
  response.cookies.delete('appwrite-user-name');
  return response;
}
