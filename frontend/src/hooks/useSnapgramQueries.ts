import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import type { Post, Comment, UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

// ---- Posts ----

export function useGetAllPosts() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ['posts', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      const posts = await actor.getPosts();
      return [...posts].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPostsByUser(userPrincipal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ['posts', 'user', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const principal = Principal.fromText(userPrincipal);
      const posts = await actor.getPostsByUser(principal);
      return [...posts].sort((a, b) => Number(b.createdAt - a.createdAt));
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, imageUrl }: { content: string; imageUrl?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content, imageUrl ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created!');
    },
    onError: (error: Error) => {
      toast.error('Failed to create post: ' + error.message);
    },
  });
}

// ---- Likes ----

export function useGetPostLikers(postId: bigint | undefined) {
  // We track liked state via a separate query on the likes list
  // Since backend doesn't expose "hasLiked", we track it client-side via the likers list
  // For now we use the post's likesCount from the post object
  return { data: null };
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to like post: ' + error.message);
    },
  });
}

export function useUnlikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unlikePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: Error) => {
      toast.error('Failed to unlike post: ' + error.message);
    },
  });
}

// ---- Comments ----

export function useGetComments(postId: bigint | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ['comments', postId?.toString()],
    queryFn: async () => {
      if (!actor || postId === undefined) return [];
      const comments = await actor.getComments(postId);
      return [...comments].sort((a, b) => Number(a.createdAt - b.createdAt));
    },
    enabled: !!actor && !actorFetching && postId !== undefined,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(postId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId.toString()] });
      toast.success('Comment added!');
    },
    onError: (error: Error) => {
      toast.error('Failed to add comment: ' + error.message);
    },
  });
}

// ---- Profiles ----

export function useGetUserProfile(userPrincipal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ['profile', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      const principal = Principal.fromText(userPrincipal);
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      displayName,
      bio,
      avatarUrl,
    }: {
      displayName: string;
      bio: string;
      avatarUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfile(displayName, bio, avatarUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated!');
    },
    onError: (error: Error) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });
}

// ---- Follow ----

export function useGetFollowers(userPrincipal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Principal[]>({
    queryKey: ['followers', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const principal = Principal.fromText(userPrincipal);
      return actor.getFollowers(principal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useGetFollowing(userPrincipal: string | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Principal[]>({
    queryKey: ['following', userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const principal = Principal.fromText(userPrincipal);
      return actor.getFollowing(principal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userToFollow: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userToFollow);
      return actor.followUser(principal);
    },
    onSuccess: (_data, userToFollow) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userToFollow] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast.success('Following!');
    },
    onError: (error: Error) => {
      toast.error('Failed to follow: ' + error.message);
    },
  });
}

export function useUnfollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userToUnfollow: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(userToUnfollow);
      return actor.unfollowUser(principal);
    },
    onSuccess: (_data, userToUnfollow) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userToUnfollow] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      toast.success('Unfollowed.');
    },
    onError: (error: Error) => {
      toast.error('Failed to unfollow: ' + error.message);
    },
  });
}
