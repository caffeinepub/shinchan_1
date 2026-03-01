import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import HomeFeedPage from './pages/HomeFeedPage';
import ExplorePage from './pages/ExplorePage';
import CreatePostPage from './pages/CreatePostPage';
import UserProfilePage from './pages/UserProfilePage';
import PostDetailPage from './pages/PostDetailPage';
import EditProfilePage from './pages/EditProfilePage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: HomeFeedPage,
});

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/explore',
  component: ExplorePage,
});

const createPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create',
  component: CreatePostPage,
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$principal',
  component: UserProfilePage,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$postId',
  component: PostDetailPage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit-profile',
  component: EditProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  feedRoute,
  exploreRoute,
  createPostRoute,
  userProfileRoute,
  postDetailRoute,
  editProfileRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
