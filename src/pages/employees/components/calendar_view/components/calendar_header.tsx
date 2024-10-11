import React, { useContext } from "react";
import calendarContext from "../context/calendar_context";
import dayjs from "dayjs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import {
	PopoverSelector,
	type PopoverSelectorDataType,
} from "~/components/popover_selector";

export default function CalendarHeader({
	target_date,
	employees,
}: {
	target_date: string;
	employees: PopoverSelectorDataType[];
}) {
	const { monthIndex, setMonthIndex, selectedEmp, setSelectedEmp } = useContext(calendarContext);
	const { t } = useTranslation(["common"]);

	function handlePrevMonth() {
		setMonthIndex(monthIndex - 1);
	}

	function handleNextMonth() {
		setMonthIndex(monthIndex + 1);
	}

	function handleReset() {
		setMonthIndex(
			monthIndex === dayjs(target_date).month()
				? monthIndex
				: dayjs(target_date).month()
		);
	}

	return (
		<div className="flex items-center gap-x-1 px-4 py-1">
			<p className="mx-4 w-40 text-xl font-bold text-primary">
				{dayjs(new Date(dayjs(target_date).year(), monthIndex)).format(
					`YYYY-MM`
				)}
			</p>

			{/* Select date */}
			<Button variant="outline" size="sm" className="my-3" onClick={handlePrevMonth}>
				<ChevronLeftIcon className="h-4 w-4" />
			</Button>
			<Button variant="outline" size="sm" className="my-3" onClick={handleReset}>
				{t("table.current")}
			</Button>
			<Button variant="outline" size="sm" className="my-3" onClick={handleNextMonth}>
				<ChevronRightIcon className="h-4 w-4" />
			</Button>

			{/* Select employee */}
			{
				employees.length > 0 &&
				<PopoverSelector
					data={employees}
					selectedKey={selectedEmp}
					setSelectedKey={setSelectedEmp}
				/>
			}
		</div>
	);
}
