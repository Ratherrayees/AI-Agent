import { Models } from 'appwrite';
import { UserRole } from '@/types/roles';

export type UserPrefs = {
  role?: UserRole;
  timezone?: string;
  theme?: 'light' | 'dark' | 'system';
};

export type User = Models.User<UserPrefs>;

export type Session = Record<string, any>;

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}
