
import React from "react";
import EventTracker, { EventType } from "../EventTracker";
import ActivitySelector from "../ActivitySelector";
import SocialTracker from "../SocialTracker";

interface TrackerRightColumnProps {
  eventTypes: EventType[];
  activities: string[];
  people: string[];
  onEventTypesChange: (eventTypes: EventType[]) => void;
  onAddActivity: (activity: string) => void;
  onRemoveActivity: (index: number) => void;
  onAddPerson: (person: string) => void;
  onRemovePerson: (index: number) => void;
}

/**
 * Component that contains event, activity, and social trackers
 */
const TrackerRightColumn: React.FC<TrackerRightColumnProps> = ({
  eventTypes,
  activities,
  people,
  onEventTypesChange,
  onAddActivity,
  onRemoveActivity,
  onAddPerson,
  onRemovePerson
}) => {
  return (
    <div className="space-y-6">
      <EventTracker values={eventTypes} onChange={onEventTypesChange} />
      <ActivitySelector
        activities={activities}
        onAddActivity={onAddActivity}
        onRemoveActivity={onRemoveActivity}
      />
      <SocialTracker
        people={people}
        onAddPerson={onAddPerson}
        onRemovePerson={onRemovePerson}
      />
    </div>
  );
};

export default TrackerRightColumn;
