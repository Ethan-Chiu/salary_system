import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

interface DialogInput {
	confirmFunction: () => void;
}

export function AllDoneDialog({ confirmFunction }: DialogInput) {
	const [check, setCheck] = useState(false);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>All Done</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update with EHR</DialogTitle>
					<DialogDescription>
						Please check the checkbox below and click the button.
						The data will update with EHR once the button is
						clicked.
					</DialogDescription>
				</DialogHeader>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="terms"
						checked={check}
						onCheckedChange={(c) =>
							setCheck(c.valueOf() as boolean)
						}
					/>
					<label
						htmlFor="terms"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						All data has been checked
					</label>
				</div>
				<DialogFooter>
					<DialogClose disabled={!check}>
						<Button
							disabled={!check}
							type="submit"
							onClick={() => confirmFunction()}
						>
							Update Data
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
