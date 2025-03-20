import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Index from "./routes/Index";
import JournalLayout from "./routes/JournalLayout";
import JournalContent from "./routes/JournalContent";
import Insights from "./routes/Insights";
import Conversations from "./routes/Conversations";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import Profile from "./routes/Profile";
import NotFound from "./routes/NotFound";
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import { Toaster } from "@/components/ui/toaster"
import Contact from './pages/Contact';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Index />}>
                  <Route index element={<Navigate to="/journal" replace />} />
                  <Route path="journal" element={<JournalLayout />}>
                    <Route index element={<JournalContent />} />
                  </Route>
                  <Route path="insights" element={<Insights />} />
                  <Route path="conversations" element={<Conversations />} />
                </Route>
                <Route path="/home" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
