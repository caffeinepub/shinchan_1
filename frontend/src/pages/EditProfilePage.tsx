import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { useUpdateProfile } from '../hooks/useSnapgramQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowLeft, User } from 'lucide-react';
import RequireAuth from '../components/auth/RequireAuth';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

function EditProfileContent() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();

  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const updateProfile = useUpdateProfile();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio);
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    updateProfile.mutate(
      { displayName: displayName.trim(), bio: bio.trim(), avatarUrl: avatarUrl.trim() },
      {
        onSuccess: () => {
          if (currentPrincipal) {
            navigate({ to: '/profile/$principal', params: { principal: currentPrincipal } });
          } else {
            navigate({ to: '/feed' });
          }
        },
      }
    );
  };

  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : 'ME';

  return (
    <div className="container max-w-lg py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            currentPrincipal
              ? navigate({ to: '/profile/$principal', params: { principal: currentPrincipal } })
              : navigate({ to: '/feed' })
          }
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Edit Profile
        </h1>
      </div>

      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Update your profile information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar Preview */}
              <div className="flex justify-center">
                <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={updateProfile.isPending}
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={updateProfile.isPending}
                  maxLength={160}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/160</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={updateProfile.isPending}
                  type="url"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    currentPrincipal
                      ? navigate({
                          to: '/profile/$principal',
                          params: { principal: currentPrincipal },
                        })
                      : navigate({ to: '/feed' })
                  }
                  disabled={updateProfile.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!displayName.trim() || updateProfile.isPending}
                  className="flex-1"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProfilePage() {
  return (
    <RequireAuth>
      <EditProfileContent />
    </RequireAuth>
  );
}
