# Specification

## Summary
**Goal:** Replace the existing Shinchan diary app with a full-stack social media app called "Snapgram" built on a new Motoko backend and a React + TypeScript frontend.

**Planned changes:**
- Replace the existing Motoko backend with a new single-actor backend supporting user profiles, posts, follow relationships, likes, and comments; all write operations require authenticated callers
- Build frontend pages: Landing/Login, Home Feed, Explore, Create Post, User Profile, Post Detail, and Edit Profile
- Gate all pages except Landing behind authentication using the existing RequireAuth component
- Wire all pages to the backend using React Query hooks with loading states, error toasts, and cache invalidation after mutations
- Apply a warm gradient color palette (pinks, oranges, sunset tones) with a card-based layout, sticky top navigation bar, and bottom tab navigation on mobile
- Display a Snapgram logo in the navigation header and a hero illustration on the landing page

**User-visible outcome:** Users can sign in with Internet Identity, create and browse posts, like and comment on posts, follow other users, and manage their profile within a cohesive warm-toned social media interface.
