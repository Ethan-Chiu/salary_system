import { useContext } from "react";
import { DataTableViewOptions } from "~/components/data_table/data_table_view_options";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { LoadingSpinner } from "~/components/loading";
import dataTableContext from "~/pages/parameters/components/context/data_table_context";

interface DataTableToolbarProps<TData> {
	filterColumnKey?: keyof TData;
}

export function DataTableToolbar<TData>({
	filterColumnKey,
}: DataTableToolbarProps<TData>) {
	const { selectedTable } = useContext(dataTableContext);
	const table = selectedTable?.table;

	if (!table) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}
	return (
		<div className="flex flex-row items-center justify-between space-x-2 px-2 py-2">
			{/* search bar */}
			<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
			{/* tabs */}
			<DataTableViewOptions table={table} />
		</div>
	);
}
