import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Compass, PlusSquare, User } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function BottomTabNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const currentPath = routerState.location.pathname;
  const currentPrincipal = identity?.getPrincipal().toString();

  const tabs = [
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur border-t border-border/60 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = currentPath === path || currentPath.startsWith(path + '/');
          return (
            <button
              key={label}
              onClick={() => navigate({ to: path as '/' })}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
