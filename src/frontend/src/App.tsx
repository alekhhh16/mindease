import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./pages/app/AppLayout";
import ChatPage from "./pages/app/ChatPage";
import MoodPage from "./pages/app/MoodPage";
import SelfHelpPage from "./pages/app/SelfHelpPage";
import SosPage from "./pages/app/SosPage";

const DashboardPage = lazy(() => import("./pages/app/DashboardPage"));

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/app",
  component: AppLayout,
});

const appIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: DashboardPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: () => (
    <Suspense
      fallback={
        <div className="flex-1 animate-pulse bg-muted/20 rounded-2xl m-4" />
      }
    >
      <DashboardPage />
    </Suspense>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/chat",
  component: ChatPage,
});

const moodRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/mood",
  component: MoodPage,
});

const selfhelpRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/selfhelp",
  component: SelfHelpPage,
});

const sosRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/sos",
  component: SosPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  appLayoutRoute.addChildren([
    appIndexRoute,
    dashboardRoute,
    chatRoute,
    moodRoute,
    selfhelpRoute,
    sosRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
