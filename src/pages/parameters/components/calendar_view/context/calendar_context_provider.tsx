import React, {
	useState,
	PropsWithChildren,
	useReducer,
	useEffect,
} from "react";
import calendarContext from "./calendar_context";
import dayjs from "dayjs";
import { CalendarEvent, CalendarEventLevel } from "../utils/calendar_event";
import { detectOverlaps } from "../utils/event_level";

export type ActionType = {
	type: "push";
};

interface CalendarContextProviderProps {}

export default function CalendarContextProvider({
	children,
}: PropsWithChildren<CalendarContextProviderProps>) {
	const [monthIndex, setMonthIndex] = useState(dayjs().month());
	const [mouseDownDate, setMouseDownDate] = useState<dayjs.Dayjs | null>(
		null
	);
	const [mouseUpDate, setMouseUpDate] = useState<dayjs.Dayjs | null>(null);

	const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(
		new CalendarEvent(new Date(), new Date())
	);
	const [openSheet, setOpenSheet] = useState<boolean>(false);

	const [eventList, dispatchEventList] = useReducer(savedEventsReducer, []);
	const [showEventList, setShowEventList] = useState<CalendarEventLevel[]>([
		new CalendarEventLevel(new Date(new Date().setDate(-1)), new Date(), 0),
	]);

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
		let showEvents = eventList;
		if (currentEvent) {
			showEvents = [...showEvents, currentEvent];
		}
		setShowEventList(detectOverlaps(showEvents));
	}, [eventList, currentEvent]);

	function savedEventsReducer(state: CalendarEvent[], { type }: ActionType) {
		switch (type) {
			case "push": {
				if (currentEvent === null) return state;

				const newState = [...state, currentEvent];

				setMouseDownDate(null);
				setMouseUpDate(null);
				setCurrentEvent(null);
				return newState;
			}
			default:
				throw new Error();
		}
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
				dispatchEventList,
				//   showEventModal,
				//   setShowEventModal,
				//   savedEvents,
			}}
		>
			{children}
		</calendarContext.Provider>
	);
}
