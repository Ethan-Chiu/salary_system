export class CalendarEvent {
	private startDate: Date;
	private endDate: Date;

	constructor(startDate: Date, endDate: Date) {
		this.startDate = startDate;
		this.endDate = endDate;
	}

	getStartDate(): Date {
		return this.startDate;
	}

	setStartDate(startDate: Date): void {
		this.startDate = startDate;
	}

	getEndDate(): Date {
		return this.endDate;
	}

	setEndDate(endDate: Date): void {
		this.endDate = endDate;
	}

	getDurationInHours(): number {
		const durationInMilliseconds =
			this.endDate.getTime() - this.startDate.getTime();
		return durationInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
	}

	overlapsWith(otherEvent: CalendarEvent): boolean {
		return (
			this.startDate < otherEvent.getEndDate() &&
			this.endDate > otherEvent.getStartDate()
		);
	}
}

export class CalendarEventLevel extends CalendarEvent {
	private level: number;

	constructor(startDate: Date, endDate: Date, level: number) {
		super(startDate, endDate);
		this.level = level;
	}

	getLevel(): number {
		return this.level;
	}

	setLevel(level: number): void {
		this.level = level;
	}
}

// Example usage:
// const event = new CalendarEvent(new Date('2024-01-01T09:00:00'), new Date('2024-01-01T12:00:00'));
