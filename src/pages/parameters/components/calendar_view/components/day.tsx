import dayjs from "dayjs";
import React, {
	useContext,
	useState,
	useEffect,
	type MouseEventHandler,
} from "react";
import { type Dayjs } from "dayjs";
import { cn } from "~/lib/utils";
import calendarContext, {
	type CalendarEventLevelWithID,
	type CalendarEventWithID,
} from "../context/calendar_context";
import { getMaxLevel } from "../utils/event_level";
import { Button } from "~/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Pen, Trash2 } from "lucide-react";
import { parameterToolbarFunctionsContext } from "../../function_sheet/parameter_functions_context";
import { get_date_string } from "~/server/service/helper_function";

interface DayViewProps {
	day: Dayjs;
	rowIdx: number;
	target_date: string;
}

export default function DayView({ day, rowIdx, target_date }: DayViewProps) {
	const {
		monthIndex,
		mouseDownDate,
		setMouseDownDate,
		mouseUpDate,
		setMouseUpDate,
		showEventList,
		setOpenSheet,
		setUpdateSheet,
		selectedEvent,
		setSelectedEvent,
	} = useContext(calendarContext);

	const mutateFunctions = useContext(parameterToolbarFunctionsContext);
	/* const updateFunction = mutateFunctions.updateFunction!; */
	/* const createFunction = mutateFunctions.createFunction!; */
	const deleteFunction = mutateFunctions.deleteFunction!;

	const [dayEvents, setDayEvents] = useState<CalendarEventLevelWithID[]>([]);

	useEffect(() => {
		const events = showEventList.filter(
			(evt) =>
				get_date_string(evt.getStartDate()) <= get_date_string(day.toDate()) &&
				get_date_string(day.toDate()) <= get_date_string(evt.getEndDate())
		);
		setDayEvents(events);
	}, [showEventList, day]);

	const handleMouseDown = (event: React.MouseEvent) => {
		event.preventDefault();
		if (event.button === 0) {
			if (!mouseDownDate) {
				setMouseDownDate(day);
			}
		}
	};

	const handleMouseUp = (event: React.MouseEvent) => {
		event.preventDefault();
		if (event.button === 0) {
			if (mouseDownDate) {
				setMouseUpDate(day);
				setOpenSheet(true);
			}
		}
	};

	const handleMouseOver = (event: React.MouseEvent) => {
		event.preventDefault();
		if (event.button === 0) {
			if (mouseDownDate) {
				setMouseUpDate(day);
			}
		}
	};

	return (
		<HoverCard>
			<div
				className={cn(
					"relative flex select-none flex-col",
					day.month() !== monthIndex % 12 && "bg-secondary"
				)}
			>
				{/* header */}
				<header className="flex flex-col items-center">
					{/* day of the week */}
					{rowIdx === 0 && (
						<p className="mt-1 text-sm">
							{day.format("ddd").toUpperCase()}
						</p>
					)}
					{/* date */}
					<p
						className={cn(
							"my-1 p-1 text-center text-sm",
							day.format("DD-MM-YY") ===
							dayjs(target_date).format("DD-MM-YY") &&
							"w-7 rounded-full bg-primary text-white"
						)}
					>
						{day.format("DD")}
					</p>
				</header>
				<div className="absolute h-full w-full border border-gray-200" />
				{/* event container */}
				<div
					className="z-10 flex-grow cursor-pointer"
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onMouseOver={handleMouseOver}
				>
					{/* events */}
					{Array.from(
						{ length: getMaxLevel(dayEvents) + 1 },
						(_, idx) => idx
					).map((idx) => {
						const evt = dayEvents.find(
							(dayEvent) => dayEvent.getLevel() === idx
						);

						if (!evt) {
							return <div key={idx} className="mb-1 h-4 p-1" />;
						}

						// selected event
						if (selectedEvent && evt.equals(selectedEvent)) {
							return (
								<HoverCardTrigger key={idx}>
									<CompEvent
										day={day}
										event={evt}
										selected={true}
										onMouseDown={(_) => {
											if (!mouseUpDate) {
												setSelectedEvent(evt);
											}
										}}
									/>
								</HoverCardTrigger>
							);
						}

						// unselected event
						return (
							<CompEvent
								key={idx}
								day={day}
								event={evt}
								selected={false}
								onMouseDown={(_) => {
									if (!mouseUpDate) {
										setSelectedEvent(evt);
									}
								}}
							/>
						);
					})}
				</div>
			</div>
			{/* event container end*/}
			<CompHoverContent />
		</HoverCard>
	);

	function CompHoverContent() {
		return (
			<HoverCardContent
				className="mx-3 w-32 rounded-full px-2 py-1 "
				side="top"
			>
				<div className="flex flex-row justify-evenly">
					<Button
						variant={"ghost"}
						className="rounded-full p-3"
						onClick={() => {
							setUpdateSheet(true);
						}}
					>
						<Pen className="h-4 w-4" />
					</Button>
					<Button
						variant={"ghost"}
						className="rounded-full p-3"
						onClick={() => {
							deleteFunction.mutate({
								id: selectedEvent?.getData()?.id,
							});
						}}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</HoverCardContent>
		);
	}
}

function CompEvent({
	event,
	selected,
	day,
	onMouseDown,
}: {
	event: CalendarEventWithID;
	selected: boolean;
	day: Dayjs;
	onMouseDown: MouseEventHandler;
}) {
	return (
		<div
			onMouseDown={(e) => {
				onMouseDown(e);
				e.stopPropagation();
			}}
			className={cn(
				"z-20 mb-1 h-4 truncate bg-primary text-sm text-gray-600 opacity-20",
				selected && "opacity-90",
				get_date_string(event.getStartDate()) == get_date_string(day.toDate()) &&
				"ml-4 rounded-s-md",
				get_date_string(event.getEndDate()) == get_date_string(day.toDate()) &&
				"mr-4 rounded-e-md"
			)}
		></div>
	);
}
