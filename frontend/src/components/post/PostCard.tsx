import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useLikePost, useUnlikePost, useGetUserProfile } from '../../hooks/useSnapgramQueries';
import type { Post } from '../../backend';

interface PostCardProps {
  post: Post;
  currentUserPrincipal?: string;
}

function formatTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / BigInt(1_000_000));
  const now = Date.now();
  const diff = now - ms;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

function AuthorInfo({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfile(principal);
  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : principal.slice(0, 2).toUpperCase();

  return (
    <Link to="/profile/$principal" params={{ principal }} className="flex items-center gap-2 group">
      <Avatar className="h-9 w-9 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
        <AvatarImage src={profile?.avatarUrl} alt={profile?.displayName} />
        <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
          {profile?.displayName ?? principal.slice(0, 8) + '...'}
        </p>
      </div>
    </Link>
  );
}

export default function PostCard({ post, currentUserPrincipal }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  const authorPrincipal = post.author.toString();

  const handleLike = async () => {
    if (liked) {
      setLiked(false);
      await unlikePost.mutateAsync(post.id).catch(() => setLiked(true));
    } else {
      setLiked(true);
      await likePost.mutateAsync(post.id).catch(() => setLiked(false));
    }
  };

  const isLikeLoading = likePost.isPending || unlikePost.isPending;

  return (
    <Card className="overflow-hidden hover:shadow-card transition-shadow duration-200 border border-border/60">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <AuthorInfo principal={authorPrincipal} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatTime(post.createdAt)}</span>
          </div>
        </div>

        {/* Content */}
        <Link to="/post/$postId" params={{ postId: post.id.toString() }}>
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.imageUrl && (
            <div className="w-full aspect-video overflow-hidden bg-muted">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1 px-3 py-2 border-t border-border/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLikeLoading || !currentUserPrincipal}
            className={`gap-1.5 h-8 px-2 ${liked ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground hover:text-rose-500'}`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{Number(post.likesCount)}</span>
          </Button>

          <Link to="/post/$postId" params={{ postId: post.id.toString() }}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8 px-2 text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Comment</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
