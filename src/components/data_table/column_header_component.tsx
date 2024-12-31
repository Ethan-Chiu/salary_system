import { type Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { type PropsWithChildren } from "react";
import { Button } from "~/components/ui/button";

interface ColumnHeaderComponentProps<T> extends PropsWithChildren {
	column: Column<T>;
}

export function ColumnHeaderBaseComponent({ children }: PropsWithChildren) {
	return (
		<div className="flex justify-center">
			<div className="text-center font-medium">{children}</div>
		</div>
	);
}

export function ColumnHeaderComponent<T>({
	column,
	children,
}: ColumnHeaderComponentProps<T>) {
	return (
		<ColumnHeaderBaseComponent>
			<Button
				variant="ghost"
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
			>
				{children}
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		</ColumnHeaderBaseComponent>
	);
}
