import React, { useContext, useEffect, useState } from "react";
import CalendarContextProvider from "./context/calendar_context_provider";
import MonthView from "./components/month";
import { getDayInMonth } from "./utils/utils";
import calendarContext from "./context/calendar_context";
import CalendarHeader from "./components/calendar_header";
import CalendarAddEvent from "./components/calendar_add_event";
import dataTableContext from "../context/data_table_context";
import ToolbarFunctionsProvider from "../function_sheet/functions_context";

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
	const { selectedTable } = useContext(dataTableContext);

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
				<ToolbarFunctionsProvider selectedTable={selectedTable}>
					<CalendarAddEvent />
				</ToolbarFunctionsProvider>
			</div>
		</>
	);
}
