
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, MessageCircle, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import FeaturePreview from "@/components/FeaturePreview";

const Home = () => {
  const { user } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  
  // Handle hovering on feature cards
  const handleFeatureHover = (feature: string | null) => {
    setHoveredFeature(feature);
  };
  
  return (
    <div className="container mx-auto px-4 flex flex-col">
      {/* Hero Section - Above the fold */}
      <section className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 px-8">
        <div className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-x-16">
          <div className="mb-12 md:mb-0">
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
          </div>
          
          {/* Feature Preview Area */}
          <div className="hidden md:flex items-center justify-center relative">
            {hoveredFeature === 'journal-log' && (
              <div className="animate-fade-in absolute inset-0 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/2ec06987-05f6-4aec-bae9-9d3e2aef3cb0.png" 
                  alt="Journal Log Preview" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg" 
                />
              </div>
            )}
            {hoveredFeature === 'ai-conversations' && (
              <div className="animate-fade-in absolute inset-0 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d63e3a4e-991a-4d31-a074-11c3d60a4693.png" 
                  alt="AI Conversations Preview" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg" 
                />
              </div>
            )}
            {!hoveredFeature && (
              <div className="text-center text-muted-foreground text-sm">
                <p>Hover over a feature to see a preview</p>
              </div>
            )}
          </div>
        </div>
          
        {/* Key Features Section - Added more space above this section */}
        <div className="mt-20 mb-8 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 w-full">
          {/* Heading and description column - now 4 columns */}
          <div className="md:col-span-4 flex flex-col justify-center pr-4">
            <h2 className="text-1.5xl md:text-2xl font-bold mb-3 whitespace-nowrap">A new looking glass</h2>
            <p className="text-muted-foreground">Explore deeper and richer insights about yourself</p>
          </div>
          
          {/* Feature cards - now 8 columns */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeaturePreview 
              previewImage="/lovable-uploads/2ec06987-05f6-4aec-bae9-9d3e2aef3cb0.png"
              previewAlt="Journal Log Preview"
              onHover={(isHovering) => handleFeatureHover(isHovering ? 'journal-log' : null)}
            >
              <Card className="h-full transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4 flex flex-col items-start h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <Book className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <h3 className="text-lg font-semibold w-full break-words">Journal Log</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Track your daily moods, activities, and reflections. Keep a record of your personal growth.
                  </p>
                </CardContent>
              </Card>
            </FeaturePreview>
            
            <FeaturePreview
              previewImage="/lovable-uploads/d63e3a4e-991a-4d31-a074-11c3d60a4693.png"
              previewAlt="AI Conversations Preview"
              onHover={(isHovering) => handleFeatureHover(isHovering ? 'ai-conversations' : null)}
            >
              <Card className="h-full transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4 flex flex-col items-start h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <MessageCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <h3 className="text-lg font-semibold w-full break-words">AI Conversations</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Chat with an AI companion that helps you process thoughts and gain new insights.
                  </p>
                </CardContent>
              </Card>
            </FeaturePreview>
            
            <Card className="h-full transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4 flex flex-col items-start h-full">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <h3 className="text-lg font-semibold w-full break-words">Mood Tracking</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Visualize patterns in your emotional state over time with intuitive charts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
