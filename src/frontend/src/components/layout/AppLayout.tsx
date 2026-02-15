import { Outlet, useNavigate } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { BookHeart, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/shinchan-logo.dim_512x512.png" 
              alt="shinchan logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">shinchan</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/face-detector' })}
                className="gap-2"
              >
                <Scan className="h-4 w-4" />
                Face Detector
              </Button>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30 py-6 mt-12">
        <div className="container flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <BookHeart className="h-4 w-4 text-rose-500" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} shinchan diary</p>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
