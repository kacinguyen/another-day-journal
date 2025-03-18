
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, MessageCircle, LogIn, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Welcome to Another Day Another Entry
        </h1>
        
        <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
          Your personal space to document daily thoughts, track moods, and reflect on your journey through journaling and AI-powered conversations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <LogIn className="mr-2 h-5 w-5" />
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign up
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Book className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Journal Log</h2>
              <p className="text-muted-foreground">
                Track your daily moods, activities, and reflections. Keep a record of your personal growth and emotional journey.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MessageCircle className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">AI Conversations</h2>
              <p className="text-muted-foreground">
                Chat with an AI companion that helps you process your thoughts, find patterns in your journal entries, and gain new insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground pb-4">
        <p>© {new Date().getFullYear()} Another Day Another Entry. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
