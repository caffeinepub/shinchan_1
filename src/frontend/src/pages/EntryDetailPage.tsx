import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllEntries } from '../hooks/useDiaryQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function EntryDetailPage() {
  const { entryId } = useParams({ from: '/entries/$entryId' });
  const navigate = useNavigate();
  const { data: entries, isLoading, error } = useGetAllEntries();

  const entry = entries?.find(e => e.id.toString() === entryId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="container max-w-3xl py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load diary entry. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-12">
        <Button variant="ghost" className="mb-6" disabled>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Entries
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container max-w-3xl py-12">
        <Button variant="ghost" onClick={() => navigate({ to: '/entries' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Entries
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Entry not found. It may have been deleted or you may not have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/entries' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Entries
      </Button>

      <Card className="border-2">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(entry.entryDate)}</span>
          </div>
          <CardTitle className="text-3xl">{entry.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-base leading-relaxed">
              {entry.content}
            </p>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Created: {formatDateTime(entry.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated: {formatDateTime(entry.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="mt-6 bg-muted/50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Edit and delete features are coming soon! The backend is being updated to support these operations.
        </AlertDescription>
      </Alert>
    </div>
  );
}
