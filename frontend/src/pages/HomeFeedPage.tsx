import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllPosts, useGetFollowing } from '../hooks/useSnapgramQueries';
import PostCard from '../components/post/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { PlusSquare, Rss } from 'lucide-react';
import RequireAuth from '../components/auth/RequireAuth';

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-border/60 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function HomeFeedContent() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();

  const { data: allPosts = [], isLoading: postsLoading } = useGetAllPosts();
  const { data: following = [], isLoading: followingLoading } = useGetFollowing(currentPrincipal);

  const isLoading = postsLoading || followingLoading;

  // Show own posts + followed users' posts
  const feedPosts = allPosts.filter((post) => {
    const authorStr = post.author.toString();
    return (
      authorStr === currentPrincipal ||
      following.some((p) => p.toString() === authorStr)
    );
  });

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Feed</h1>
          <p className="text-sm text-muted-foreground">Posts from you and people you follow</p>
        </div>
        <Button
          onClick={() => navigate({ to: '/create' })}
          size="sm"
          className="gap-1.5"
        >
          <PlusSquare className="h-4 w-4" />
          <span className="hidden sm:inline">New Post</span>
        </Button>
      </div>

      {/* Feed */}
      {isLoading ? (
        <FeedSkeleton />
      ) : feedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Rss className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Your feed is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Follow people or create your first post to get started.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate({ to: '/explore' })} variant="outline" size="sm">
              Explore Posts
            </Button>
            <Button onClick={() => navigate({ to: '/create' })} size="sm">
              Create Post
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedPosts.map((post) => (
            <PostCard key={post.id.toString()} post={post} currentUserPrincipal={currentPrincipal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomeFeedPage() {
  return (
    <RequireAuth>
      <HomeFeedContent />
    </RequireAuth>
  );
}
