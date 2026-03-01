import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllPosts } from '../hooks/useSnapgramQueries';
import PostCard from '../components/post/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass } from 'lucide-react';
import RequireAuth from '../components/auth/RequireAuth';

function ExploreSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border border-border/60 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function ExploreContent() {
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();
  const { data: posts = [], isLoading, isError } = useGetAllPosts();

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" />
          Explore
        </h1>
        <p className="text-sm text-muted-foreground">Discover posts from the Snapgram community</p>
      </div>

      {isLoading ? (
        <ExploreSkeleton />
      ) : isError ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>Failed to load posts. Please try again.</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <Compass className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-lg">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to share something with the community!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id.toString()} post={post} currentUserPrincipal={currentPrincipal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <RequireAuth>
      <ExploreContent />
    </RequireAuth>
  );
}
