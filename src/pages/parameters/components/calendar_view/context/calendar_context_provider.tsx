import React, {
	useState,
	PropsWithChildren,
	useReducer,
	useEffect,
} from "react";
import calendarContext from "./calendar_context";
import dayjs from "dayjs";
import { CalendarEvent, CalendarEventLevel } from "../utils/calendar_event";
import { getEventLevel } from "../utils/event_level";

export type ActionType = {
	type: "push";
};

interface CalendarContextProviderProps {
	data: any[];
}

export default function CalendarContextProvider({
	data,
	children,
}: PropsWithChildren<CalendarContextProviderProps>) {
	const [monthIndex, setMonthIndex] = useState(dayjs().month());
	const [mouseDownDate, setMouseDownDate] = useState<dayjs.Dayjs | null>(
		null
	);
	const [mouseUpDate, setMouseUpDate] = useState<dayjs.Dayjs | null>(null);

	const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(
		null
	);
	const [openSheet, setOpenSheet] = useState<boolean>(false);

	// const [eventList, dispatchEventList] = useReducer(savedEventsReducer, []);
	const [eventList, setEventList] = useState<CalendarEvent[]>([]);
	const [showEventList, setShowEventList] = useState<CalendarEventLevel[]>(
		[]
	);

	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null
	);

	useEffect(() => {
		if (mouseDownDate && mouseUpDate) {
			setCurrentEvent(
				new CalendarEvent(mouseDownDate.toDate(), mouseUpDate.toDate())
			);
		} else {
			setCurrentEvent(null);
		}
	}, [mouseDownDate, mouseUpDate]);

	useEffect(() => {
		setEventList(
			data
				.sort((a, b) => {
					if (a.start_date == null) {
						return -1;
					} else if (b.start_date == null) {
						return 1;
					} else {
						return a.start_date > b.start_date ? -1 : 1;
					}
				})
				.map((dataItem) => {
					const event = new CalendarEvent(
						new Date(dataItem.start_date),
						new Date(dataItem.end_date ?? 8630000000000000),
						dataItem
					);
					return event;
				})
		);
	}, [data]);

	useEffect(() => {
		let showEvents = eventList;
		if (currentEvent) {
			showEvents = [...showEvents, currentEvent];
		}
		setShowEventList(getEventLevel(showEvents));
	}, [eventList, currentEvent]);

	function savedEventsReducer(state: CalendarEvent[], { type }: ActionType) {
		switch (type) {
			case "push": {
				if (currentEvent === null) return state;

				const newState = [...state, currentEvent];

				resetMouse();
				return newState;
			}
			default:
				throw new Error();
		}
	}

	function resetMouse() {
		setMouseDownDate(null);
		setMouseUpDate(null);
		setCurrentEvent(null);
	}

	return (
		<calendarContext.Provider
			value={{
				monthIndex,
				setMonthIndex,
				mouseDownDate,
				setMouseDownDate,
				mouseUpDate,
				setMouseUpDate,
				openSheet,
				setOpenSheet,
				showEventList,
				setEventList,
				selectedEvent,
				setSelectedEvent,
				resetMouse,
				//   showEventModal,
				//   setShowEventModal,
				//   savedEvents,
			}}
		>
			{children}
		</calendarContext.Provider>
	);
}
