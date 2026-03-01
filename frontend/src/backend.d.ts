import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Comment {
    id: bigint;
    content: string;
    createdAt: Time;
    author: Principal;
    postId: bigint;
}
export interface UserProfile {
    bio: string;
    displayName: string;
    createdAt: Time;
    avatarUrl: string;
}
export interface Post {
    id: bigint;
    content: string;
    createdAt: Time;
    author: Principal;
    imageUrl?: string;
    likesCount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: bigint, content: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(content: string, imageUrl: string | null): Promise<bigint>;
    createProfile(displayName: string, bio: string, avatarUrl: string): Promise<void>;
    followUser(userToFollow: Principal): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(postId: bigint): Promise<Array<Comment>>;
    getFollowers(user: Principal): Promise<Array<Principal>>;
    getFollowing(user: Principal): Promise<Array<Principal>>;
    getPosts(): Promise<Array<Post>>;
    getPostsByUser(user: Principal): Promise<Array<Post>>;
    getProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    unfollowUser(userToUnfollow: Principal): Promise<void>;
    unlikePost(postId: bigint): Promise<void>;
    updateProfile(displayName: string, bio: string, avatarUrl: string): Promise<void>;
}
