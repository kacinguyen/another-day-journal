
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book, MessageCircle, BarChart } from "lucide-react";
import FeaturePreview from "@/components/FeaturePreview";
import FeatureCard from "@/components/home/FeatureCard";

const Home = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>('journal-log');

  const handleFeatureHover = (feature: string | null) => {
    setHoveredFeature(feature || 'journal-log');
  };

  return (
    <div className="container mx-auto px-4 flex flex-col">
      <section className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 px-8">
        <div className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-x-16">
          <div className="mb-12 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Another day, another entry.</h1>

            <p className="text-lg mb-10 text-muted-foreground max-w-2xl">
              Your personal space to document daily thoughts, track moods, and reflect on your journey through journaling and AI-powered conversations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-auto">
                  Create an entry
                </Button>
              </Link>
            </div>
          </div>

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
            {hoveredFeature === 'mood-tracking' && (
              <div className="animate-fade-in absolute inset-0 flex items-center justify-center">
                <img
                  src="/lovable-uploads/6df9d951-5ed2-4bf3-b412-e705f1af0f68.png"
                  alt="Mood Tracking Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-20 mb-8 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 w-full">
          <div className="md:col-span-4 flex flex-col justify-center pr-4">
            <h2 className="text-1.5xl md:text-2xl font-bold mb-3 whitespace-nowrap">A new looking glass</h2>
            <p className="text-muted-foreground">Explore deeper and richer insights about yourself</p>
          </div>

          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeaturePreview
              previewImage="/lovable-uploads/2ec06987-05f6-4aec-bae9-9d3e2aef3cb0.png"
              previewAlt="Journal Log Preview"
              onHover={(isHovering) => handleFeatureHover(isHovering ? 'journal-log' : null)}
            >
              <FeatureCard
                title="Journal Log"
                description="Track your daily moods, activities, and reflections. Keep a record of your personal growth."
                icon={<Book className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                isActive={hoveredFeature === 'journal-log'}
              />
            </FeaturePreview>

            <FeaturePreview
              previewImage="/lovable-uploads/d63e3a4e-991a-4d31-a074-11c3d60a4693.png"
              previewAlt="AI Conversations Preview"
              onHover={(isHovering) => handleFeatureHover(isHovering ? 'ai-conversations' : null)}
            >
              <FeatureCard
                title="AI Conversations"
                description="Chat with an AI companion that helps you process thoughts and gain new insights."
                icon={<MessageCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                isActive={hoveredFeature === 'ai-conversations'}
              />
            </FeaturePreview>

            <FeaturePreview
              previewImage="/lovable-uploads/6df9d951-5ed2-4bf3-b412-e705f1af0f68.png"
              previewAlt="Mood Tracking Preview"
              onHover={(isHovering) => handleFeatureHover(isHovering ? 'mood-tracking' : null)}
            >
              <FeatureCard
                title="Mood Tracking"
                description="Visualize patterns in your emotional state over time with intuitive charts."
                icon={<BarChart className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                isActive={hoveredFeature === 'mood-tracking'}
              />
            </FeaturePreview>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
