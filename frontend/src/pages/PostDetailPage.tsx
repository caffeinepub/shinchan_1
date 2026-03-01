import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllPosts, useGetComments, useLikePost, useUnlikePost, useGetUserProfile } from '../hooks/useSnapgramQueries';
import CommentsList from '../components/comments/CommentsList';
import AddCommentForm from '../components/comments/AddCommentForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Clock } from 'lucide-react';
import { useState } from 'react';
import RequireAuth from '../components/auth/RequireAuth';
import { Link } from '@tanstack/react-router';

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  return new Date(ms).toLocaleString();
}

function AuthorInfo({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfile(principal);
  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : principal.slice(0, 2).toUpperCase();

  return (
    <Link to="/profile/$principal" params={{ principal }} className="flex items-center gap-3 group">
      <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
        <AvatarImage src={profile?.avatarUrl} alt={profile?.displayName} />
        <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-sm font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold group-hover:text-primary transition-colors">
          {profile?.displayName ?? principal.slice(0, 8) + '...'}
        </p>
        {profile?.bio && (
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{profile.bio}</p>
        )}
      </div>
    </Link>
  );
}

function PostDetailContent() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity?.getPrincipal().toString();

  const { data: allPosts = [], isLoading: postsLoading } = useGetAllPosts();
  const postIdBigInt = BigInt(postId);
  const post = allPosts.find((p) => p.id === postIdBigInt);

  const { data: comments = [], isLoading: commentsLoading } = useGetComments(
    post ? post.id : undefined
  );

  const [liked, setLiked] = useState(false);
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  const handleLike = async () => {
    if (!post) return;
    if (liked) {
      setLiked(false);
      await unlikePost.mutateAsync(post.id).catch(() => setLiked(true));
    } else {
      setLiked(true);
      await likePost.mutateAsync(post.id).catch(() => setLiked(false));
    }
  };

  if (postsLoading) {
    return (
      <div className="container max-w-2xl py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-2xl py-16 text-center text-muted-foreground">
        <p>Post not found.</p>
        <Button variant="link" onClick={() => navigate({ to: '/feed' })}>
          Back to Feed
        </Button>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold">Post</h1>
      </div>

      {/* Post */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <AuthorInfo principal={post.author.toString()} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(post.createdAt)}</span>
          </div>
        </div>

        <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-border/60 aspect-video bg-muted">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Like button */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={likePost.isPending || unlikePost.isPending || !currentPrincipal}
            className={`gap-2 ${liked ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground hover:text-rose-500'}`}
          >
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-medium">{Number(post.likesCount)} likes</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="font-semibold text-base">
          Comments ({comments.length})
        </h2>

        {currentPrincipal && <AddCommentForm postId={post.id} />}

        {commentsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CommentsList comments={comments} />
        )}
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  return (
    <RequireAuth>
      <PostDetailContent />
    </RequireAuth>
  );
}
