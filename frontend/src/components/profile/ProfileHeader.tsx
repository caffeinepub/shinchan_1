import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import FollowButton from './FollowButton';
import type { UserProfile } from '../../backend';

interface ProfileHeaderProps {
  profile: UserProfile;
  principal: string;
  currentUserPrincipal?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export default function ProfileHeader({
  profile,
  principal,
  currentUserPrincipal,
  followersCount,
  followingCount,
  postsCount,
}: ProfileHeaderProps) {
  const isOwnProfile = currentUserPrincipal === principal;
  const initials = profile.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : principal.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 ring-4 ring-primary/20 shrink-0">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold truncate">{profile.displayName}</h2>
            {!isOwnProfile && <FollowButton targetPrincipal={principal} />}
          </div>
          {profile.bio && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex gap-6 text-center">
        <div>
          <p className="text-lg font-bold">{postsCount}</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div>
          <p className="text-lg font-bold">{followersCount}</p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        <div>
          <p className="text-lg font-bold">{followingCount}</p>
          <p className="text-xs text-muted-foreground">Following</p>
        </div>
      </div>
    </div>
  );
}
