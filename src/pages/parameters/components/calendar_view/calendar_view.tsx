import React, { useContext, useEffect, useState } from "react";
import CalendarContextProvider from "./context/calendar_context_provider";
import MonthView from "./components/month";
import { getDayInMonth } from "./utils/utils";
import calendarContext from "./context/calendar_context";
import CalendarHeader from "./components/calendar_header";

export default function CalendarView() {
	return (
		<>
			<CalendarContextProvider>
				<CompCalendarView />
			</CalendarContextProvider>
		</>
	);
}

function CompCalendarView() {
	const [currenMonth, setCurrentMonth] = useState(getDayInMonth(null));
	const { monthIndex } = useContext(calendarContext);

	useEffect(() => {
		setCurrentMonth(getDayInMonth(monthIndex));
	}, [monthIndex]);

	return (
        <>
            {/* {showEventModal && <EventModal />} */}
            <div className="flex h-screen flex-col">
                <CalendarHeader />
                <div className="flex flex-1">
                    <MonthView month={currenMonth} />
                </div>
            </div>
        </>
	);
}
