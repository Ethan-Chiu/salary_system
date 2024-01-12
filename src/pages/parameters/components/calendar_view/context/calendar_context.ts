import React from "react";

const calendarContext = React.createContext({
	monthIndex: 0,
	setMonthIndex: (index: number) => {},
	// smallCalendarMonth: 0,
	// setSmallCalendarMonth: (index) => {},
	// daySelected: null,
	// setDaySelected: (day) => {},
	// showEventModal: false,
	// setShowEventModal: () => {},
	// dispatchCalEvent: ({ type, payload }) => {},
	// savedEvents: [],
	// selectedEvent: null,
	// setSelectedEvent: () => {},
	// setLabels: () => {},
	// labels: [],
	// updateLabel: () => {},
	// filteredEvents: [],
});

export default calendarContext;
