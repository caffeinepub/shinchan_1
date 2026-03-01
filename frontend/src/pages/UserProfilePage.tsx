import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetUserProfile,
  useGetPostsByUser,
  useGetFollowers,
  useGetFollowing,
} from '../hooks/useSnapgramQueries';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Grid } from 'lucide-react';
import RequireAuth from '../components/auth/RequireAuth';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="flex gap-6">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-10 w-16" />
      </div>
    </div>
  );
}

function UserProfileContent() {
  const { principal } = useParams({ from: '/profile/$principal' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();
  const isOwnProfile = currentPrincipal === principal;

  const { data: profile, isLoading: profileLoading } = useGetUserProfile(principal);
  const { data: posts = [], isLoading: postsLoading } = useGetPostsByUser(principal);
  const { data: followers = [] } = useGetFollowers(principal);
  const { data: following = [] } = useGetFollowing(principal);

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/feed' })}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Profile</h1>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/edit-profile' })}
            className="ml-auto gap-1.5"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {profileLoading ? (
        <ProfileSkeleton />
      ) : !profile ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>User not found.</p>
        </div>
      ) : (
        <ProfileHeader
          profile={profile}
          principal={principal}
          currentUserPrincipal={currentPrincipal}
          followersCount={followers.length}
          followingCount={following.length}
          postsCount={posts.length}
        />
      )}

      {/* Posts Grid */}
      <div>
        <h2 className="text-base font-semibold flex items-center gap-2 mb-4">
          <Grid className="h-4 w-4" />
          Posts
        </h2>
        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-border/60 p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No posts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id.toString()}
                post={post}
                currentUserPrincipal={currentPrincipal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <RequireAuth>
      <UserProfileContent />
    </RequireAuth>
  );
}
