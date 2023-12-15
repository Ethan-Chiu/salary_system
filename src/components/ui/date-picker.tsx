"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { forwardRef } from "react";

import { isDate } from "~/pages/develop_parameters/utils/checkType";

function preprocessDate(date: any) {
	date = new Date(date);
	return date;
}

export const DatePicker = forwardRef<
	HTMLDivElement,
	{
		date?: Date;
		setDate: (date?: Date) => void;
	}
>(function DatePickerCmp({ date, setDate }, ref) {
    var formatted_date
    try {
        formatted_date = date?.toISOString().split("T")[0];
    } catch(e) {
        formatted_date = "";
    }
	return (
		<Input
			type="date"
			defaultValue={
				formatted_date
			}
			onChange={(e) => {
				if (isDate(e.target.valueAsDate))
					setDate(e.target.valueAsDate!);
			}}
		/>
		// <Popover>
		//   <PopoverTrigger asChild>
		//     <Button
		//       variant={"outline"}
		//       className={cn(
		//         "w-full justify-start text-left font-normal",
		//         !date && "text-muted-foreground",
		//       )}
		//     >
		//       <CalendarIcon className="mr-2 h-4 w-4" />
		//       {date ? format(preprocessDate(date), "PPP") : <span>Pick a date</span>}
		//     </Button>
		//   </PopoverTrigger>
		//   <PopoverContent className="w-auto p-0" ref={ref}>
		//     <Input type="date"/>
		//     <Calendar
		//       mode="single"
		//       selected={date}
		//       onSelect={setDate}
		//       initialFocus
		//     />
		//   </PopoverContent>
		// </Popover>
	);
});
