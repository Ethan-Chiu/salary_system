export class CalendarEvent {
	private startDate: Date;
	private endDate: Date;
	private data: any;

	constructor(startDate: Date, endDate: Date, data: any = null) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.data = data;
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

	getData(): any {
		return this.data;
	}

	setData(data: any): void {
		this.data = data;
	}

	overlapsWith(otherEvent: CalendarEvent): boolean {
		return (
			this.startDate <= otherEvent.getEndDate() &&
			this.endDate >= otherEvent.getStartDate()
		);
	}

	equals(otherEvent: CalendarEvent): boolean {
        return (
            this.startDate.getTime() === otherEvent.getStartDate().getTime() &&
            this.endDate.getTime() === otherEvent.getEndDate().getTime()
        );
    }

	toCalendarEventLevel(level: number): CalendarEventLevel {
		return new CalendarEventLevel(this.startDate, this.endDate, level, this.data);
	}
}

export class CalendarEventLevel extends CalendarEvent {
	private level: number;

	constructor(startDate: Date, endDate: Date, level: number, data: any = null) {
		super(startDate, endDate, data);
		this.level = level;
	}

	getLevel(): number {
		return this.level;
	}

	setLevel(level: number): void {
		this.level = level;
	}
}
