import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DiaryEntry } from '../backend';
import { toast } from 'sonner';

export function useGetAllEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DiaryEntry[]>({
    queryKey: ['diaryEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntriesByDate();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateDiaryEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string; entryDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDiaryEntry(data.title, data.content, data.entryDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryEntries'] });
      toast.success('Entry created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create entry');
    },
  });
}
