import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { useFollowUser, useUnfollowUser, useGetFollowers } from '../../hooks/useSnapgramQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface FollowButtonProps {
  targetPrincipal: string;
}

export default function FollowButton({ targetPrincipal }: FollowButtonProps) {
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();

  const { data: followers = [] } = useGetFollowers(targetPrincipal);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isFollowing = followers.some((p) => p.toString() === currentPrincipal);
  const isLoading = followUser.isPending || unfollowUser.isPending;

  const handleToggle = () => {
    if (isFollowing) {
      unfollowUser.mutate(targetPrincipal);
    } else {
      followUser.mutate(targetPrincipal);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      className="gap-1.5 min-w-[100px]"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
