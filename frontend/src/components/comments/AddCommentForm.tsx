import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useAddComment } from '../../hooks/useSnapgramQueries';

interface AddCommentFormProps {
  postId: bigint;
}

export default function AddCommentForm({ postId }: AddCommentFormProps) {
  const [content, setContent] = useState('');
  const addComment = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment.mutate(
      { postId, content: content.trim() },
      {
        onSuccess: () => setContent(''),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={addComment.isPending}
        rows={2}
        maxLength={300}
        className="resize-none flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (content.trim()) handleSubmit(e as unknown as React.FormEvent);
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!content.trim() || addComment.isPending}
        className="shrink-0 h-10 w-10"
      >
        {addComment.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
