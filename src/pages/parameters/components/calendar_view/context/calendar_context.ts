import React from "react";
import dayjs from "dayjs";

const calendarContext = React.createContext({
	monthIndex: 0,
	setMonthIndex: (index: number) => {},
	mouseDownDate: dayjs(),
	setMouseDownDate: (date: dayjs.Dayjs) => {},
	mouseUpDate: dayjs(),
	setMouseUpDate: (date: dayjs.Dayjs) => {},
	// showEventModal: false,
	// setShowEventModal: () => {},
	// savedEvents: [],
});

export default calendarContext;
