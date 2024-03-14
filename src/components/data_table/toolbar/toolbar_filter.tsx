import { type Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	filterColumnKey?: keyof TData;
}

export function ToolbarFilter<TData>({
	table,
	filterColumnKey,
}: DataTableToolbarProps<TData>) {

	const [filterValue, setFilterValue] = useState("");

	useEffect(() => {
		if (table) {
			setFilterValue("");
			if (filterColumnKey) {
				table.getColumn(filterColumnKey.toString())?.setFilterValue("");
			} else {
				table.setGlobalFilter("");
			}
		}
	}, [filterColumnKey, table]);

	return (
			<Input
				placeholder="Filter setting..."
				value={filterValue}
				onChange={(event) => {
					if (filterColumnKey) {
						table
							.getColumn(filterColumnKey.toString())
							?.setFilterValue(event.target.value);
					} else {
						table.setGlobalFilter(event.target.value);
					}
					setFilterValue(event.target.value);
				}}
				className="h-8 max-w-sm"
			/>
			
	);
}
