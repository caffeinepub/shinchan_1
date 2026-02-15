import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, PenLine, Calendar, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/entries' });
    } else {
      login();
    }
  };

  return (
    <div className="relative">
      {/* Hero Section with Background Pattern */}
      <div 
        className="relative bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-rose-50/80 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20"
        style={{
          backgroundImage: 'url(/assets/generated/shinchan-pattern.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative container max-w-5xl py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Your Personal Diary Space</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                shinchan
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Capture your thoughts, memories, and daily adventures in your private digital diary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                disabled={loginStatus === 'logging-in'}
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                {isAuthenticated ? 'View My Diary' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container max-w-5xl py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <PenLine className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold">Write Freely</h3>
              <p className="text-muted-foreground">
                Express yourself without limits. Your thoughts, your way.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold">Track Your Days</h3>
              <p className="text-muted-foreground">
                Organize entries by date and revisit your favorite memories.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold">Private & Secure</h3>
              <p className="text-muted-foreground">
                Your diary is yours alone, protected by blockchain technology.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
