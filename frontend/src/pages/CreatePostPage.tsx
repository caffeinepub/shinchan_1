import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusSquare, Image, ArrowLeft } from 'lucide-react';
import { useCreatePost } from '../hooks/useSnapgramQueries';
import RequireAuth from '../components/auth/RequireAuth';

const MAX_CONTENT_LENGTH = 500;

function CreatePostContent() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost.mutate(
      { content: content.trim(), imageUrl: imageUrl.trim() || undefined },
      {
        onSuccess: () => {
          navigate({ to: '/feed' });
        },
      }
    );
  };

  const remaining = MAX_CONTENT_LENGTH - content.length;

  return (
    <div className="container max-w-2xl py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/feed' })}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PlusSquare className="h-6 w-6 text-primary" />
          Create Post
        </h1>
      </div>

      <Card className="border border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-medium text-muted-foreground">
            Share something with the community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="content">What's on your mind? *</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, stories, or moments..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createPost.isPending}
                rows={5}
                maxLength={MAX_CONTENT_LENGTH}
                className="resize-none"
              />
              <div className={`text-xs text-right ${remaining < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {remaining} characters remaining
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-1.5">
                <Image className="h-3.5 w-3.5" />
                Image URL (optional)
              </Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={createPost.isPending}
                type="url"
              />
              {imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border/60 aspect-video bg-muted">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/feed' })}
                disabled={createPost.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!content.trim() || createPost.isPending}
                className="flex-1"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <RequireAuth>
      <CreatePostContent />
    </RequireAuth>
  );
}
