import React, { useContext, useEffect, useState } from "react";
import CalendarContextProvider from "./context/calendar_context_provider";
import MonthView from "./components/month";
import { getDayInMonth } from "./utils/utils";
import calendarContext from "./context/calendar_context";
import CalendarHeader from "./components/calendar_header";
import CalendarAddEvent from "./components/calendar_add_event";
import dataTableContext from "../context/data_table_context";
// import ParameterToolbarFunctionsProvider from "../function_sheet/parameter_functions_context";
import { LoadingSpinner } from "~/components/loading";
// import CalendarUpdateEvent from "./components/calendar_update_event";
import periodContext from "~/components/context/period_context";
import { useTranslation } from "react-i18next";
import { HistoryQueryFunctionType } from "~/components/data_table/history_data_type";
import { EmployeeHistoryViewCommonEmpInfo } from "../history_view/history_view";

interface DataTableProps {
	dataFunction: HistoryQueryFunctionType<EmployeeHistoryViewCommonEmpInfo>;
}

export default function CalendarView({ dataFunction }: DataTableProps) {
	const { selectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);
	const { t } = useTranslation(["common"]);

	return (
		<>
			{selectedPeriod ? (
				// <ParameterToolbarFunctionsProvider
				// 	selectedTableType={selectedTableType}
				// 	period_id={selectedPeriod.period_id}
				// >
					<CompCalendarContent
						target_date={selectedPeriod.end_date}
						dataFunction={dataFunction}
					/>
				// </ParameterToolbarFunctionsProvider>
			) : (
				<p>{t("others.select_period")}</p>
			)}
		</>
	);
}

function CompCalendarContent({
	target_date,
	dataFunction,
}: {
	target_date: string;
	dataFunction: HistoryQueryFunctionType<EmployeeHistoryViewCommonEmpInfo>;
}) {
	const { isLoading, isError, data, error } = dataFunction();

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<CalendarContextProvider data={data!} target_date={target_date}>
			<CompCalendarView target_date={target_date} />
		</CalendarContextProvider>
	);
}

function CompCalendarView({ target_date }: { target_date: string }) {
	const [currenMonth, setCurrentMonth] = useState(
		getDayInMonth(target_date, null)
	);
	const { monthIndex } = useContext(calendarContext);

	useEffect(() => {
		setCurrentMonth(getDayInMonth(target_date, monthIndex));
	}, [monthIndex]);

	return (
		<>
			<div className="flex h-full flex-col">
				<CalendarHeader target_date={target_date} />
				<div className="flex h-0 flex-grow">
					{/* <ScrollArea className="w-full"> */}
					<MonthView month={currenMonth} target_date={target_date} />
					{/* </ScrollArea> */}
				</div>
				<CalendarAddEvent />
				{/* <CalendarUpdateEvent /> */}
			</div>
		</>
	);
}
