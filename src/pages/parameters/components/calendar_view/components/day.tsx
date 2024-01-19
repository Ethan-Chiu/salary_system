import dayjs from "dayjs";
import React, {
	useContext,
	useState,
	useEffect,
	MouseEventHandler,
} from "react";
import { type Dayjs } from "dayjs";
import { cn } from "~/lib/utils";
import calendarContext from "../context/calendar_context";
import { CalendarEvent, CalendarEventLevel } from "../utils/calendar_event";
import { getMaxLevel } from "../utils/event_level";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Pen, Trash2 } from "lucide-react";
import { toolbarFunctionsContext } from "../../function_sheet/functions_context";

interface DayViewProps {
	day: Dayjs;
	rowIdx: number;
}

export default function DayView({ day, rowIdx }: DayViewProps) {
	const {
		mouseDownDate,
		setMouseDownDate,
		mouseUpDate,
		setMouseUpDate,
		showEventList,
		setOpenSheet,
		selectedEvent,
		setSelectedEvent,
		setEventList,
	} = useContext(calendarContext);

	const mutateFunctions = useContext(toolbarFunctionsContext);
	const updateFunction = mutateFunctions.updateFunction!;
	const createFunction = mutateFunctions.createFunction!;
	const deleteFunction = mutateFunctions.deleteFunction!;

	const [dayEvents, setDayEvents] = useState<CalendarEventLevel[]>([]);

	useEffect(() => {
		const events = showEventList.filter(
			(evt) =>
				dayjs(evt.getStartDate()) <= day &&
				day < dayjs(evt.getEndDate()).add(1, "day")
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
		<HoverCard>
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
							day.format("DD-MM-YY") ===
								dayjs().format("DD-MM-YY") &&
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
							return <div key={idx} className="mb-1 h-4 p-1" />;
						}

						if (selectedEvent && evt.equals(selectedEvent)) {
							return (
								<HoverCardTrigger key={idx}>
									<CompEvent
										day={day}
										event={evt}
										selected={true}
										onClick={() => {
											setSelectedEvent(evt);
										}}
									/>
								</HoverCardTrigger>
							);
						}

						return (
							<CompEvent
								key={idx}
								day={day}
								event={evt}
								selected={false}
								onClick={() => {
									setSelectedEvent(evt);
								}}
							/>
						);
					})}
				</div>
			</div>
			<HoverCardContent
				className="mx-3 w-32 rounded-full px-2 py-1 "
				side="top"
			>
				<div className="flex flex-row justify-evenly">
					<Button variant={"ghost"} className="rounded-full p-3">
						<Pen className="h-4 w-4" />
					</Button>
					<Button
						variant={"ghost"}
						className="rounded-full p-3"
						onClick={() => {
							console.log(selectedEvent?.getData());
							deleteFunction.mutate({
								id: selectedEvent?.getData().id,
							});
						}}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

function CompEvent({
	event,
	selected,
	day,
	onClick,
}: {
	event: CalendarEvent;
	selected: boolean;
	day: Dayjs;
	onClick: MouseEventHandler;
}) {
	return (
		<div
			onClick={onClick}
			onMouseDown={(e) => {
				e.stopPropagation();
			}}
			onMouseUp={(e) => {
				e.stopPropagation();
			}}
			onMouseOver={(e) => {
				e.stopPropagation();
			}}
			className={cn(
				"z-20 mb-1 h-4 truncate bg-primary text-sm text-gray-600 opacity-20",
				selected && "opacity-90",
				dayjs(event.getStartDate()) <= day &&
					day < dayjs(event.getStartDate()).add(1, "day") &&
					"ml-4 rounded-s-md",
				dayjs(event.getEndDate()) <= day &&
					day < dayjs(event.getEndDate()).add(1, "day") &&
					"mr-4 rounded-e-md"
			)}
		></div>
	);
}
