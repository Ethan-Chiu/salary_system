import { CalendarEvent, CalendarEventLevel } from "./calendar_event";

export function getEventLevel(events: CalendarEvent[]): CalendarEventLevel[] {
	const sortedEvents = events
		.map(
			(event) =>
				new CalendarEventLevel(
					event.getStartDate(),
					event.getEndDate(),
					0
				)
		)
		.sort(
			(a, b) => a.getStartDate().getTime() - b.getStartDate().getTime()
		);

	let handledEvents = new Set<CalendarEventLevel>();
	let currentLevel = 0;
	let currentLevelLastEvent: CalendarEventLevel | null = null;

	while (handledEvents.size < sortedEvents.length) {
		for (let i = 0; i < sortedEvents.length; i++) {
			const currentEvent = sortedEvents[i]!;
			if (!handledEvents.has(currentEvent)) {
				if (
					currentLevelLastEvent &&
					currentEvent.overlapsWith(currentLevelLastEvent)
				) {
					currentEvent.setLevel(currentLevel + 1);
				} else {
					currentEvent.setLevel(currentLevel);
					handledEvents.add(currentEvent);
					currentLevelLastEvent = currentEvent;
				}
			}
		}
        currentLevel++;
        currentLevelLastEvent = null;
	}

	return sortedEvents;
}

export function getMaxLevel(events: CalendarEventLevel[]): number {
    let maxLevel = -1;
    for (const event of events) {
        if (event.getLevel() > maxLevel) {
            maxLevel = event.getLevel();
        }
    }
    return maxLevel;
}
