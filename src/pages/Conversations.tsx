
import React from "react";

const Conversations = () => {
  return (
    <div className="page-container animate-fade-up">
      <div className="space-y-1">
        <div className="inline-block">
          <span className="text-xs font-medium text-journal-accent-foreground bg-journal-accent/10 px-2 py-0.5 rounded-full">
            Coming Soon
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground max-w-2xl">
          This page will allow you to have conversations with an AI based on your journal entries.
        </p>
      </div>
      
      <div className="mt-12 flex items-center justify-center">
        <div className="text-center max-w-md p-8 glass-card rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Feature In Development</h2>
          <p className="text-muted-foreground">
            The Conversations feature is currently being developed and will be available soon. 
            Check back later to gain insights from your journal entries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Conversations;
