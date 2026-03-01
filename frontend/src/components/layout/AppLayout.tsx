import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import ProfileSetupDialog from '../auth/ProfileSetupDialog';
import SponsoredLinkFooterSection from './SponsoredLinkFooterSection';
import BottomTabNav from './BottomTabNav';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { Home, Compass, PlusSquare, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;
  const currentPrincipal = identity?.getPrincipal().toString();
  const currentPath = routerState.location.pathname;

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const navLinks = [
    { icon: Home, label: 'Home', path: '/feed' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: PlusSquare, label: 'Create', path: '/create' },
    {
      icon: User,
      label: 'Profile',
      path: currentPrincipal ? `/profile/${currentPrincipal}` : '/feed',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: isAuthenticated ? '/feed' : '/' })}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/snapgram-logo.dim_320x80.png"
              alt="Snapgram"
              className="h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-xl font-bold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              snapgram
            </span>
          </button>

          {/* Desktop Nav */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ icon: Icon, label, path }) => {
                const isActive =
                  currentPath === path || currentPath.startsWith(path.split('/:')[0] + '/');
                return (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: path as '/' })}
                    className={`gap-1.5 ${isActive ? 'text-primary bg-primary/10' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      <footer className="hidden md:block border-t border-border/40 bg-muted/30 py-6 mt-8">
        <div className="container flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
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
          <SponsoredLinkFooterSection />
          <p className="text-xs">© {new Date().getFullYear()} Snapgram</p>
        </div>
      </footer>

      {isAuthenticated && <BottomTabNav />}
      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}
