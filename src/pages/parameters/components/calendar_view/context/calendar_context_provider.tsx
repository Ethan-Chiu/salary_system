import React, { useState, PropsWithChildren, useReducer, useEffect } from "react";
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
	const [mouseDownDate, setMouseDownDate] = useState(dayjs());
	const [mouseUpDate, setMouseUpDate] = useState(dayjs());

	const [openSheet, setOpenSheet] = useState<boolean>(false);

	const [eventList, dispatchEventList] = useReducer(savedEventsReducer, []);
	const [showEventList, setShowEventList] = useState<CalendarEventLevel[]>(
		[new CalendarEventLevel(new Date(new Date().setDate(-1)) , new Date(), 0)]
	);

	useEffect(() => {
		setShowEventList(detectOverlaps(eventList));
	}, [eventList]);

	function savedEventsReducer(state: CalendarEvent[], { type }: ActionType) {
		switch (type) {
			case "push":
				return [
					...state,
					new CalendarEvent(
						mouseDownDate.toDate(),
						mouseUpDate.toDate()
					),
				];
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
				dispatchEventList
				//   showEventModal,
				//   setShowEventModal,
				//   savedEvents,
			}}
		>
			{children}
		</calendarContext.Provider>
	);
}
