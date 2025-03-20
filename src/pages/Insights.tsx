import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchJournalEntries } from "@/services/journalService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MoodChart from "@/components/insights/MoodChart";
import EnergySummary from "@/components/insights/EnergySummary";
import ActivitySummary from "@/components/insights/ActivitySummary";
import PositiveActivitiesCard from "@/components/insights/PositiveActivitiesCard";
import { format, subDays } from "date-fns";

const Insights = () => {
  const { user } = useAuth();
  
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: fetchJournalEntries,
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading insights...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-2xl font-semibold">Sign in to view insights</h2>
          <p className="text-muted-foreground">You need to be logged in to view your journal insights.</p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-2xl font-semibold">No journal entries yet</h2>
          <p className="text-muted-foreground">Start journaling to see insights about your moods and activities.</p>
        </div>
      </div>
    );
  }

  const today = new Date();
  const last7Days = subDays(today, 7);
  const last30Days = subDays(today, 30);
  const last90Days = subDays(today, 90);

  const last7DaysEntries = entries.filter(entry => entry.date >= last7Days);
  const last30DaysEntries = entries.filter(entry => entry.date >= last30Days);
  const last90DaysEntries = entries.filter(entry => entry.date >= last90Days);

  return (
    <div className="container py-10 animate-fade-up">
      <div className="space-y-2 mb-8">
        <div className="inline-block">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 px-2 py-0.5 rounded-full">Insights</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your Journal Insights</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore patterns and trends from your journal entries to gain a deeper understanding of your moods and experiences.
        </p>
      </div>

      <Tabs defaultValue="7days" className="space-y-6">
        <TabsList>
          <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
          <TabsTrigger value="90days">Last 90 Days</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="7days" className="space-y-6">
          <MoodInsightsContent entries={last7DaysEntries} />
        </TabsContent>

        <TabsContent value="30days" className="space-y-6">
          <MoodInsightsContent entries={last30DaysEntries} />
        </TabsContent>

        <TabsContent value="90days" className="space-y-6">
          <MoodInsightsContent entries={last90DaysEntries} />
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <MoodInsightsContent entries={entries} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MoodInsightsContent = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No entries found for this time period.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Mood Tracker</CardTitle>
          <CardDescription>
            Visualize how your mood has changed over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <MoodChart entries={entries} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Energy Levels</CardTitle>
          <CardDescription>
            Your average energy levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnergySummary entries={entries} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Activities</CardTitle>
          <CardDescription>
            Activities you mentioned most frequently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivitySummary entries={entries} />
        </CardContent>
      </Card>

      <Card className="col-span-2 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-blue-100 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-black dark:text-white">Advanced Insights</span>
          </CardTitle>
          <CardDescription>
            Activities associated with your positive moods (great & good)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PositiveActivitiesCard entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;
