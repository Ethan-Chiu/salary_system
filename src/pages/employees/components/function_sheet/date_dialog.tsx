import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { DatePicker } from "~/components/ui/date-picker";
import { Button } from "~/components/ui/button";
import { useState } from "react";

interface DateDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSubmit: (date: Date) => void;
}

// TODO: validate date is valid
export function DateDialog({ open, setOpen, onSubmit }: DateDialogProps) {
	const [date, setDate] = useState<Date>(new Date());

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</DialogDescription>
				</DialogHeader>
				<DatePicker
					date={date}
					setDate={(d) => {
						if (d) {
							setDate(d);
						}
					}}
				/>
				<DialogFooter>
					<Button onClick={() => onSubmit(date)}>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
