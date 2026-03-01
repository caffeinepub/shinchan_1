import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetUserProfile } from '../../hooks/useSnapgramQueries';
import type { Comment } from '../../backend';
import { MessageCircle } from 'lucide-react';

interface CommentsListProps {
  comments: Comment[];
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

function CommentItem({ comment }: { comment: Comment }) {
  const authorPrincipal = comment.author.toString();
  const { data: profile } = useGetUserProfile(authorPrincipal);
  const initials = profile?.displayName
    ? profile.displayName.slice(0, 2).toUpperCase()
    : authorPrincipal.slice(0, 2).toUpperCase();

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={profile?.avatarUrl} alt={profile?.displayName} />
        <AvatarFallback className="bg-gradient-to-br from-rose-400 to-orange-400 text-white text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">
            {profile?.displayName ?? authorPrincipal.slice(0, 8) + '...'}
          </span>
          <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

export default function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
        <MessageCircle className="h-8 w-8 opacity-40" />
        <p className="text-sm">No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
      {comments.map((comment) => (
        <CommentItem key={comment.id.toString()} comment={comment} />
      ))}
    </div>
  );
}
