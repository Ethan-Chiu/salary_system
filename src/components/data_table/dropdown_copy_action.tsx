import { DropdownMenuItem } from "~/components/ui/dropdown-menu";

interface DropdownCopyActionProps {
	value: string;
}

export function DropdownCopyAction({ value }: DropdownCopyActionProps) {
	//   const task = taskSchema.parse(row.original)

	return (
		<DropdownMenuItem
			onClick={() => {
				void (async () => {
					await navigator.clipboard.writeText(value);
				})();
			}}
		>
			Copy Value
		</DropdownMenuItem>
	);
}
