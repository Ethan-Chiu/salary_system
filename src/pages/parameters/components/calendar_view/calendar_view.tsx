import React, { useContext, useEffect, useState } from "react";
import CalendarContextProvider from "./context/calendar_context_provider";
import MonthView from "./components/month";
import { getDayInMonth } from "./utils/utils";
import calendarContext from "./context/calendar_context";
import CalendarHeader from "./components/calendar_header";
import CalendarAddEvent from "./components/calendar_add_event";
import dataTableContext from "../context/data_table_context";
import ParameterToolbarFunctionsProvider from "../function_sheet/parameter_functions_context";
import ApiFunctionsProvider, {
	apiFunctionsContext,
} from "../context/api_context_provider";
import { LoadingSpinner } from "~/components/loading";
import CalendarUpdateEvent from "./components/calendar_update_event";

export default function CalendarView() {
	const { selectedTableType } = useContext(dataTableContext);

	return (
		<>
			<ApiFunctionsProvider selectedTableType={selectedTableType}>
				<ParameterToolbarFunctionsProvider selectedTableType={selectedTableType}>
					<CompCalendarContent />
				</ParameterToolbarFunctionsProvider>
			</ApiFunctionsProvider>
		</>
	);
}

function CompCalendarContent() {
	const queryFunctions = useContext(apiFunctionsContext);
	const queryFunction = queryFunctions.queryFunction!;

	/* const mutateFunctions = useContext(toolbarFunctionsContext); */
	/* const updateFunction = mutateFunctions.updateFunction!; */
	/* const createFunction = mutateFunctions.createFunction!; */
	/* const deleteFunction = mutateFunctions.deleteFunction!; */

	const { isLoading, isError, data, error } = queryFunction();

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<CalendarContextProvider data={data}>
			<CompCalendarView />
		</CalendarContextProvider>
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
			<div className="flex h-full flex-col">
				<CalendarHeader />
				<div className="flex h-0 flex-grow">
					{/* <ScrollArea className="w-full"> */}
					<MonthView month={currenMonth} />
					{/* </ScrollArea> */}
				</div>
				<CalendarAddEvent />
				<CalendarUpdateEvent />
			</div>
		</>
	);
}
