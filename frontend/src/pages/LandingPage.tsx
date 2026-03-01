import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Users, Image, Heart, Loader2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/feed' });
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 container max-w-6xl py-16 md:py-24">
        {/* Left: Branding & CTA */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                snapgram
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-md mx-auto md:mx-0">
              Share your moments, connect with friends, and discover stories from around the world.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoggingIn}
              className="text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 border-0 text-white"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : isAuthenticated ? (
                'Go to Feed'
              ) : (
                'Get Started'
              )}
            </Button>
          </div>

          <div className="flex items-center gap-6 justify-center md:justify-start text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-rose-500" />
              <span>Connect with friends</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Image className="h-4 w-4 text-orange-500" />
              <span>Share moments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-amber-500" />
              <span>Spread love</span>
            </div>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-orange-400/20 to-amber-400/20 rounded-3xl blur-3xl" />
            <img
              src="/assets/generated/snapgram-hero.dim_1200x600.png"
              alt="Snapgram - Share your moments"
              className="relative w-full rounded-2xl shadow-2xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 border-t border-border/40 py-16">
        <div className="container max-w-5xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Everything you need to stay connected
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                color: 'text-rose-500',
                bg: 'bg-rose-50 dark:bg-rose-950/30',
                title: 'Follow Friends',
                desc: 'Stay updated with the people who matter most to you.',
              },
              {
                icon: Image,
                color: 'text-orange-500',
                bg: 'bg-orange-50 dark:bg-orange-950/30',
                title: 'Share Moments',
                desc: 'Post photos and stories to share your daily adventures.',
              },
              {
                icon: Heart,
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-950/30',
                title: 'Like & Comment',
                desc: 'Engage with posts through likes and meaningful comments.',
              },
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-card border border-border/60 hover:shadow-card transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
