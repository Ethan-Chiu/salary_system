import React, { useState, PropsWithChildren, useReducer } from "react";
import calendarContext from "./calendar_context";
import dayjs from "dayjs";
import { CalendarEvent, CalendarEventLevel } from "../utils/calendar_event";

type ActionType = {
	type: "push";
};

interface CalendarContextProviderProps {}

export default function CalendarContextProvider({
	children,
}: PropsWithChildren<CalendarContextProviderProps>) {
	const [monthIndex, setMonthIndex] = useState(dayjs().month());
	const [mouseDownDate, setMouseDownDate] = useState(dayjs());
	const [mouseUpDate, setMouseUpDate] = useState(dayjs());

	const [eventList, dispatchEventList] = useReducer(savedEventsReducer, []);
	const [showEventList, setShowEventList] = useState<CalendarEventLevel[]>(
		[]
	);

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

				//   showEventModal,
				//   setShowEventModal,
				//   savedEvents,
			}}
		>
			{children}
		</calendarContext.Provider>
	);
}
