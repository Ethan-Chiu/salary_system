import { CalendarEvent, CalendarEventLevel } from "./calendar_event";

export function detectOverlaps(events: CalendarEvent[]): CalendarEventLevel[] {
    const sortedEvents = events
        .map(event => new CalendarEventLevel(event.getStartDate(), event.getEndDate(), 0))
        .sort((a, b) => a.getStartDate().getTime() - b.getStartDate().getTime());

    for (let i = 0; i < sortedEvents.length; i++) {
        const currentEvent = sortedEvents[i];

        for (let j = i + 1; j < sortedEvents.length; j++) {
            const nextEvent = sortedEvents[j];

            if (currentEvent!.overlapsWith(nextEvent!)) {
                // If there is an overlap, set the level of the next event to be different
                nextEvent!.setLevel(currentEvent!.getLevel() + 1);
            }
        }
    }

    return sortedEvents;
}