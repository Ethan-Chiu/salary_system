import React from "react";
import type dayjs from "dayjs";
import {
	type CalendarEvent,
	type CalendarEventLevel,
} from "../utils/calendar_event";

const calendarContext = React.createContext<{
	monthIndex: number;
	setMonthIndex: (index: number) => void;
	mouseDownDate: dayjs.Dayjs | null;
	setMouseDownDate: (date: dayjs.Dayjs) => void;
	mouseUpDate: dayjs.Dayjs | null;
	setMouseUpDate: (date: dayjs.Dayjs) => void;
	openSheet: boolean;
	setOpenSheet: (open: boolean) => void;
	updateSheet: boolean;
	setUpdateSheet: (open: boolean) => void;
	showEventList: CalendarEventLevel[];
	setEventList: (event: CalendarEvent[]) => void;
	selectedEvent: CalendarEvent | null;
	setSelectedEvent: (event: CalendarEvent) => void;
	resetMouse: () => void;
	// dispatchEventList: React.Dispatch<ActionType>,
}>({
	monthIndex: 0,
	setMonthIndex: (_: number) => undefined,
	mouseDownDate: null,
	setMouseDownDate: (_: dayjs.Dayjs) => undefined,
	mouseUpDate: null,
	setMouseUpDate: (_: dayjs.Dayjs) => undefined,
	// open sheet
	openSheet: false,
	setOpenSheet: (_: boolean) => undefined,
	// update event
	updateSheet: false,
	setUpdateSheet: (_: boolean) => undefined,
	// event list that will be shown
	showEventList: [],
	setEventList: (_: CalendarEvent[]) => undefined,
	selectedEvent: null,
	setSelectedEvent: (_: CalendarEvent) => undefined,
	resetMouse: () => undefined,
});

export default calendarContext;
