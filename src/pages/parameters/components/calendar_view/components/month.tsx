import React from "react";
import { type Dayjs } from "dayjs";
import DayView from "./day";

interface MonthViewProps {
	month: Array<Array<Dayjs>>;
}

export default function MonthView({ month }: MonthViewProps): JSX.Element {
	return (
		<div className="grid flex-1 grid-cols-7 grid-rows-5">
			{month.map((row, i) => (
				<React.Fragment key={i}>
					{row.map((day, idx) => (
						<DayView day={day} key={idx} rowIdx={i} />
					))}
				</React.Fragment>
			))}
		</div>
	);
}
