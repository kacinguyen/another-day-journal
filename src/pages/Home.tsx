
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, MessageCircle, LogIn, UserPlus, BarChart, Clock, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 flex flex-col">
      {/* Hero Section - Above the fold */}
      <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Another Day Another Entry</h1>
          
          <p className="text-xl mb-10 text-muted-foreground max-w-2xl mx-auto">
            Your personal space to document daily thoughts, track moods, and reflect on your journey through journaling and AI-powered conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            {user ? (
              <Link to="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Book className="mr-2 h-5 w-5" />
                  Go to journal
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <LogIn className="mr-2 h-5 w-5" />
                  Log in
                </Button>
              </Link>
            )}
            {!user && (
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign up
                </Button>
              </Link>
            )}
          </div>
          
          <div className="hidden sm:block">
            <svg className="w-6 h-6 mx-auto mt-16 animate-bounce text-muted-foreground" 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24" 
                 xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>
      
      {/* Features Section - Below the fold */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <Book className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Journal Log</h3>
                <p className="text-muted-foreground">
                  Track your daily moods, activities, and reflections. Keep a record of your personal growth and emotional journey.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <MessageCircle className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">AI Conversations</h3>
                <p className="text-muted-foreground">
                  Chat with an AI companion that helps you process your thoughts, find patterns in your journal entries, and gain new insights.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <BarChart className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Visualize patterns in your emotional state over time with intuitive charts and graphs to gain deeper self-awareness.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <Clock className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Daily Reminders</h3>
                <p className="text-muted-foreground">
                  Never miss a day of journaling with customizable reminders that help you maintain consistency in your practice.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <Shield className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your thoughts are personal. We ensure your journal entries remain private and secure with end-to-end encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <footer className="py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Another Day Another Entry. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
