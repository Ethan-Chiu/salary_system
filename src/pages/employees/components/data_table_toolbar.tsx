import { type Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "~/components/data_table/data_table_view_options";
import { Input } from "~/components/ui/input";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	globalFilter: string;
	filterKey?: keyof TData;
	showTabs?: boolean;
	table_name?: string;
}

export function DataTableToolbar<TData>({
	table,
	filterKey,
}: DataTableToolbarProps<TData>) {
	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<Input
				placeholder="Filter setting..."
				value={
          filterKey ? 
					(table
						.getColumn(filterKey.toString())
						?.getFilterValue() as string) : (
               table.getState().globalFilter as string 
            )
				}
				onChange={(event) => {
					table
						.getColumn(filterKey.toString())
						?.setFilterValue(event.target.value);
				}}
				className="h-8 max-w-sm"
			/>
			{/* tabs */}
			<DataTableViewOptions table={table} />
		</div>
	);
}
