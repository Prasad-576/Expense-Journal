import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 pb-safe relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--secondary)]/20 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 border-white/60 shadow-[var(--shadow-float)]">
        <CardContent className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[var(--primary-gradient)] rounded-[14px] flex items-center justify-center shadow-lg shadow-[var(--primary)]/30">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--primary)]">
                FinTrack
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-color)] tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[14px] text-[var(--text-muted)] font-medium mt-2">
              Login to manage your expenses.
            </p>
          </div>

          <div className="space-y-5 mt-8">
            {error && (
              <p className="text-[13px] font-semibold text-[var(--danger)] text-center animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full h-[56px] text-[16px] flex items-center justify-center gap-3 border-[1.5px] border-[var(--primary)]/20 hover:bg-[var(--primary)]/5"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span className="font-bold text-[var(--text-color)]">
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
