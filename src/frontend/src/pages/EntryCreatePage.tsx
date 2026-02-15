import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateDiaryEntry } from '../hooks/useDiaryQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

export default function EntryCreatePage() {
  const navigate = useNavigate();
  const createEntry = useCreateDiaryEntry();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    const dateObj = new Date(entryDate);
    const timestamp = BigInt(dateObj.getTime() * 1_000_000);

    createEntry.mutate(
      { title: title.trim(), content: content.trim(), entryDate: timestamp },
      {
        onSuccess: () => {
          navigate({ to: '/entries' });
        },
      }
    );
  };

  const handleCancel = () => {
    navigate({ to: '/entries' });
  };

  return (
    <div className="container max-w-3xl py-12">
      <Button variant="ghost" onClick={handleCancel} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Entries
      </Button>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Entry</CardTitle>
          <CardDescription>
            Capture your thoughts and memories for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="entryDate">Date</Label>
              <Input
                id="entryDate"
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                disabled={createEntry.isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createEntry.isPending}
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createEntry.isPending}
                required
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Share your day, your feelings, or anything on your mind
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={!title.trim() || !content.trim() || createEntry.isPending}
                className="flex-1 gap-2"
              >
                {createEntry.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Entry
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={createEntry.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
