import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import { type Dayjs } from "dayjs";
import { cn } from "~/lib/utils";

interface DayViewProps {
	day: Dayjs;
	rowIdx: number;
}

export default function DayView({ day, rowIdx }: DayViewProps) {
	const [dayEvents, setDayEvents] = useState([]);
	//   const {
	//     setDaySelected,
	//     setShowEventModal,
	//     filteredEvents,
	//     setSelectedEvent,
	//   } = useContext(GlobalContext);

	//   useEffect(() => {
	//     const events = filteredEvents.filter(
	//       (evt) =>
	//         dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
	//     );
	//     setDayEvents(events);
	//   }, [filteredEvents, day]);

	return (
		<div className="flex flex-col border border-gray-200">
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
			<div
				className="flex-1 cursor-pointer"
				onClick={() => {
					//   setDaySelected(day);
					//   setShowEventModal(true);
				}}
			>
				{dayEvents.map((evt, idx) => (
					<div
						key={idx}
						// onClick={() => setSelectedEvent(evt)}
						// className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
					>
						{/* {evt.title} */}
					</div>
				))}
			</div>
		</div>
	);
}
