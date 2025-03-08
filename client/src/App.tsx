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