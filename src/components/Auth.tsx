import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { toast } from './ui/use-toast';
type AuthView = 'login' | 'signup' | 'forgot';
export const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'login') {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: 'Success!',
          description: 'Logged in successfully'
        });
      } else if (view === 'signup') {
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}`
          }
        });
        if (error) throw error;
        
        // Create school profile
        if (data.user) {
          await supabase.from('school_profiles').insert({
            id: data.user.id,
            school_name: schoolName,
            email: email
          });
        }
        
        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast({
            title: 'Check Your Email!',
            description: 'We sent you a confirmation link. Click it to activate your account.',
            duration: 8000
          });
        } else {
          toast({
            title: 'Success!',
            description: 'Account created successfully!',
          });
        }
      }

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast({
        title: 'Email Sent!',
        description: 'Check your email for password reset instructions.'
      });
      setView('login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Stat Master</CardTitle>
          <CardDescription className="text-center">
            {view === 'login' && 'Login to your school account'}
            {view === 'signup' && 'Create your school account'}
            {view === 'forgot' && 'Reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === 'forgot' ? <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form> : <form onSubmit={handleAuth} className="space-y-4">
              {view === 'signup' && <Input placeholder="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} required />}
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? 'Loading...' : view === 'login' ? 'Login' : 'Sign Up'}
              </Button>
            </form>}
          <div className="mt-4 space-y-2 text-center">
            {view === 'login' && <>
                <button onClick={() => setView('forgot')} className="block w-full text-sm text-gray-600 hover:text-red-600 hover:underline">
                  Forgot Password?
                </button>
                <button onClick={() => setView('signup')} className="block w-full text-sm text-red-600 hover:underline">
                  Don't have an account? Sign up
                </button>
              </>}
            {view === 'signup' && <button onClick={() => setView('login')} className="text-sm text-red-600 hover:underline">
                Already have an account? Login
              </button>}
            {view === 'forgot' && <button onClick={() => setView('login')} className="text-sm text-red-600 hover:underline">
                Back to Login
              </button>}
          </div>
        </CardContent>
      </Card>
    </div>;
};