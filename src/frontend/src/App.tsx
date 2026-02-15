import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import EntriesListPage from './pages/EntriesListPage';
import EntryDetailPage from './pages/EntryDetailPage';
import EntryCreatePage from './pages/EntryCreatePage';
import FaceDetectorPage from './pages/FaceDetectorPage';
import RequireAuth from './components/auth/RequireAuth';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const entriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entries',
  component: () => (
    <RequireAuth>
      <EntriesListPage />
    </RequireAuth>
  ),
});

const entryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entries/$entryId',
  component: () => (
    <RequireAuth>
      <EntryDetailPage />
    </RequireAuth>
  ),
});

const entryCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entries/new',
  component: () => (
    <RequireAuth>
      <EntryCreatePage />
    </RequireAuth>
  ),
});

const faceDetectorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/face-detector',
  component: () => (
    <RequireAuth>
      <FaceDetectorPage />
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  entriesRoute,
  entryDetailRoute,
  entryCreateRoute,
  faceDetectorRoute,
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
