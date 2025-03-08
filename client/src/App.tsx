import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Loading from "@/components/ui/Loading";
import { NewsletterPopup } from "@/components/ui/NewsletterPopup";
import NotFound from "@/pages/not-found";

// Lazy loaded pages
const Home = lazy(() => import("@/pages/Home"));
const Services = lazy(() => import("@/pages/Services"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Booking = lazy(() => import("@/pages/Booking"));

/**
 * Renders the main application routing structure within a layout.
 *
 * This component wraps the routing configuration in a layout and suspense fallback to handle lazy-loaded routes.
 * It defines routes for the home, services, about, contact, booking, privacy, and terms pages, and includes a fallback
 * route that renders the NotFound component for undefined paths.
 *
 * @returns A JSX element representing the routing layout.
 */
function Router() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/hizmetlerimiz" component={Services} />
          <Route path="/hakkimizda" component={About} />
          <Route path="/iletisim" component={Contact} />
          <Route path="/randevu" component={Booking} />
          <Route path="/gizlilik" component={Privacy} />
          <Route path="/kosullar" component={Terms} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

/**
 * Renders the root application component.
 *
 * Wraps the app with a query client provider to manage server state, and includes routing, a newsletter popup,
 * and a toaster for notifications.
 *
 * @returns The main application JSX element.
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <NewsletterPopup />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;