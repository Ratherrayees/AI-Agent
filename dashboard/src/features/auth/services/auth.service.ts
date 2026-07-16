import { account } from '@/lib/appwrite';
import { User, Session } from '../types';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';

let sharedMePromise: Promise<any> | null = null;

async function getMeData() {
  if (sharedMePromise) return sharedMePromise;
  sharedMePromise = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      const res = await fetch('/api/auth/me', {
        headers: { 'Cache-Control': 'no-cache' },
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          return data;
        }
      }
    } catch (err) {
      // ignore (includes abort on timeout)
    } finally {
      sharedMePromise = null;
    }
    return null;
  })();
  return sharedMePromise;
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!APPWRITE_CONFIG.projectId) {
        return null;
      }
      const me = await getMeData();
      if (me && me.user) {
        return me.user as User;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async getCurrentSession(): Promise<Session | null> {
    try {
      if (!APPWRITE_CONFIG.projectId) {
        return null;
      }
      const me = await getMeData();
      if (me && me.session) {
        return me.session as Session;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async login(email: string, password: string): Promise<Session> {
    if (!APPWRITE_CONFIG.projectId) {
      throw new Error('Appwrite Project ID is not configured in .env.local');
    }
    return await account.createEmailPasswordSession(email, password);
  },

  async logout(): Promise<void> {
    try {
      if (APPWRITE_CONFIG.projectId) {
        await account.deleteSession('current');
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        // ignore
      }
    }
  },

  async requestPasswordRecovery(email: string, url: string): Promise<void> {
    if (APPWRITE_CONFIG.projectId) {
      await account.createRecovery(email, url);
    }
  },
};

