import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import { type Dayjs } from "dayjs";
import { cn } from "~/lib/utils";
import calendarContext from "../context/calendar_context";
import { CalendarEventLevel } from "../utils/calendar_event";
import { getMaxLevel } from "../utils/event_level";

interface DayViewProps {
	day: Dayjs;
	rowIdx: number;
}

export default function DayView({ day, rowIdx }: DayViewProps) {
	const [dayEvents, setDayEvents] = useState<CalendarEventLevel[]>([]);

	const {
		mouseDownDate,
		setMouseDownDate,
		mouseUpDate,
		setMouseUpDate,
		showEventList,
		setOpenSheet,
		setEventList,
	} = useContext(calendarContext);

	useEffect(() => {
		const events = showEventList.filter(
			(evt) =>
				dayjs(evt.getStartDate()) <= day &&
				day < dayjs(evt.getEndDate()).add(1, 'day')
		);
		setDayEvents(events);
	}, [showEventList, day]);

	const handleMouseDown = (event: React.MouseEvent) => {
		event.preventDefault();
		if (event.button === 0) {
			console.log("Mouse button down");
			setMouseDownDate(day);
		}
	};

	const handleMouseUp = (event: React.MouseEvent) => {
		if (event.button === 0) {
			console.log("Mouse button up");
			setMouseUpDate(day);
			// dispatchEventList({ type: "push" });
			setOpenSheet(true);
		}
	};

	const handleMouseOver = (event: React.MouseEvent) => {
		if (event.button === 0) {
			console.log("Mouse button over");
			setMouseUpDate(day);
		}
	};

	return (
		<div className="relative flex select-none flex-col">
			<header className="flex flex-col items-center">
				{rowIdx === 0 && (
					<p className="mt-1 text-sm">
						{day.format("ddd").toUpperCase()}
					</p>
				)}
				<p
					className={cn(
						"my-1 p-1 text-center text-sm",
						day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") &&
							"w-7 rounded-full bg-primary text-white"
					)}
				>
					{day.format("DD")}
				</p>
			</header>
			<div className="absolute h-full w-full border border-gray-200" />
			<div
				className="z-10 flex-grow cursor-pointer"
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseOver={handleMouseOver}
			>
				{Array.from(
					{ length: getMaxLevel(dayEvents) + 1 },
					(_, idx) => idx
				).map((idx) => {
					const evt = dayEvents.find(
						(dayEvent) => dayEvent.getLevel() === idx
					);

					if (!evt) {
						return <div key={idx} className="mb-1 h-6 p-1" />;
					}
					return (
						<div
							key={idx}
							// onClick={() => setSelectedEvent(evt)}`
							className="mb-1 h-6 truncate bg-primary text-sm text-gray-600"
						>
							{evt.getLevel()}
						</div>
					);
				})}
			</div>
		</div>
	);
}
