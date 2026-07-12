import { account } from '@/lib/appwrite';
import { User, Session } from '../types';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      if (!APPWRITE_CONFIG.projectId) {
        return null;
      }
      return (await account.get()) as User;
    } catch (error) {
      return null;
    }
  },

  async getCurrentSession(): Promise<Session | null> {
    try {
      if (!APPWRITE_CONFIG.projectId) {
        return null;
      }
      return await account.getSession('current');
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
    }
  },

  async requestPasswordRecovery(email: string, url: string): Promise<void> {
    if (APPWRITE_CONFIG.projectId) {
      await account.createRecovery(email, url);
    }
  },
};
