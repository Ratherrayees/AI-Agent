'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { loginSchema, LoginFormData } from '../validation/auth.schema';
import { authService } from '../services/auth.service';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { APP_NAME } from '@/constants';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const passwordParam = params.get('password');
    const errorParam = params.get('error');

    if (emailParam) form.setValue('email', emailParam);
    if (passwordParam) form.setValue('password', passwordParam);
    if (errorParam) toast.error(errorParam);

    if (emailParam || passwordParam || errorParam) {
      window.history.replaceState({}, document.title, '/login');
    }
  }, [form]);

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const serverData = await res.json();

      if (!res.ok || !serverData.success) {
        throw new Error(serverData.error || 'Failed to login. Please check your credentials.');
      }

      authService.login(data.email, data.password).catch(() => {});

      toast.success('Login successful');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 50);
    } catch (error: any) {
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border border-border">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
