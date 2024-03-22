import React, { useContext } from "react";
import calendarContext from "../context/calendar_context";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function CalendarHeader({ target_date }: { target_date: string }) {
	const { monthIndex, setMonthIndex } = useContext(calendarContext);

	function handlePrevMonth() {
		setMonthIndex(monthIndex - 1);
	}

	function handleNextMonth() {
		setMonthIndex(monthIndex + 1);
	}

	function handleReset() {
		setMonthIndex(
			monthIndex === dayjs(target_date).month() ? monthIndex : dayjs(target_date).month()
		);
	}

	return (
		<div className="flex items-center gap-x-1 px-4 py-1">
			<p className="mx-4 w-40 text-xl font-bold text-primary">
				{dayjs(new Date(dayjs(target_date).year(), monthIndex)).format(
					"MMMM YYYY"
				)}
			</p>

			<Button variant="outline" size="sm" onClick={handlePrevMonth}>
				<span className="sr-only">Go to previous month</span>
				<ChevronLeftIcon className="h-4 w-4" />
			</Button>
			<Button variant="outline" size="sm" onClick={handleReset}>
				Today
			</Button>
			<Button variant="outline" size="sm" onClick={handleNextMonth}>
				<span className="sr-only">Go to next month</span>
				<ChevronRightIcon className="h-4 w-4" />
			</Button>
		</div>
	);
}
