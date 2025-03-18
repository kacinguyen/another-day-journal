
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, MessageCircle, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 flex flex-col">
      {/* Hero Section - Above the fold */}
      <section className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 px-8">
        <div className="max-w-full">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Another day, another entry.</h1>
          
          <p className="text-lg mb-10 text-muted-foreground max-w-2xl">
            Your personal space to document daily thoughts, track moods, and reflect on your journey through journaling and AI-powered conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            {user ? (
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  Create an entry
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started
                </Button>
              </Link>
            )}
          </div>
          
          {/* Key Features Section - Rearranged to have heading and text alongside cards */}
          <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 w-full">
            {/* Heading and description column - now 4 columns */}
            <div className="md:col-span-4 flex flex-col justify-center pr-4">
              <h2 className="text-1.5xl md:text-2xl font-bold mb-3 whitespace-nowrap">A new looking glass</h2>
              <p className="text-muted-foreground">Explore deeper and richer insights about yourself</p>
            </div>
            
            {/* Feature cards - now 8 columns */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="h-full">
                <CardContent className="p-4 flex flex-col items-start h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <Book className="h-10 w-10 text-primary flex-shrink-0" />
                    <h3 className="text-lg font-semibold">Journal Log</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Track your daily moods, activities, and reflections. Keep a record of your personal growth.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="p-4 flex flex-col items-start h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="h-10 w-10 text-primary flex-shrink-0" />
                    <h3 className="text-lg font-semibold break-words">AI Conversations</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Chat with an AI companion that helps you process thoughts and gain new insights.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="p-4 flex flex-col items-start h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart className="h-10 w-10 text-primary flex-shrink-0" />
                    <h3 className="text-lg font-semibold">Mood Tracking</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Visualize patterns in your emotional state over time with intuitive charts.
                  </p>
                </CardContent>
              </Card>
            </div>
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
