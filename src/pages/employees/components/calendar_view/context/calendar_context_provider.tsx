import React, { useState, type PropsWithChildren, useEffect } from "react";
import calendarContext, {
	type CalendarEventLevelWithID,
	type CalendarEventWithID,
} from "./calendar_context";
import dayjs from "dayjs";
import { CalendarEvent } from "../utils/calendar_event";
import { getEventLevel } from "../utils/event_level";

interface RecordData {
	id: number;
  emp_no: string;
	start_date: Date;
	end_date: Date | null;
}

interface CalendarContextProviderProps<T extends RecordData> {
	data: T[];
	target_date: string;
}

export default function CalendarContextProvider<T extends RecordData>({
	data,
	target_date,
	children,
}: PropsWithChildren<CalendarContextProviderProps<T>>) {
	const [monthIndex, setMonthIndex] = useState(dayjs(target_date).month());
	const [mouseDownDate, setMouseDownDate] = useState<dayjs.Dayjs | null>(
		null
	);
	const [mouseUpDate, setMouseUpDate] = useState<dayjs.Dayjs | null>(null);

	const [currentEvent, setCurrentEvent] =
		useState<CalendarEventWithID | null>(null);
	const [openSheet, setOpenSheet] = useState<boolean>(false);
	const [updateSheet, setUpdateSheet] = useState<boolean>(false);

	// const [eventList, dispatchEventList] = useReducer(savedEventsReducer, []);
	const [eventList, setEventList] = useState<CalendarEventWithID[]>([]);
	const [showEventList, setShowEventList] = useState<
		CalendarEventLevelWithID[]
	>([]);

	const [selectedEvent, setSelectedEvent] =
		useState<CalendarEventWithID | null>(null);

  const [selectedEmp, setSelectedEmp] = useState<string | null>(null);

	// Select the first when data loaded
	useEffect(() => {
		if (data?.[0]) {
			setSelectedEmp(data[0].emp_no);
		}
	}, [data]);

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
        .filter((d) => d.emp_no === selectedEmp)
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
						new Date(dataItem.end_date ?? 250000000000000),
						dataItem
					);
					return event;
				})
		);
	}, [data, selectedEmp]);

	useEffect(() => {
		let showEvents = eventList;
		if (currentEvent) {
			showEvents = [...showEvents, currentEvent];
		}
		setShowEventList(getEventLevel(showEvents));
	}, [eventList, currentEvent]);

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
				updateSheet,
				setUpdateSheet,
				showEventList,
				setEventList,
				selectedEvent,
				setSelectedEvent,
				resetMouse,
        selectedEmp,
        setSelectedEmp,
			}}
		>
			{children}
		</calendarContext.Provider>
	);
}
