import { Table } from "@tanstack/react-table";
import { DataTableToolbarWrapper } from "../toolbar/data_table_toolbar_wrapper";
import { DataTableViewOptions } from "../toolbar/data_table_view_options";
import { ToolbarFilter } from "../toolbar/toolbar_filter";

interface DataTableSrandardToolbarProps<TData> {
	table: Table<TData>;
	filterColumnKey?: keyof TData;
}
export function DataTableStandardToolbar<TData>({
	table,
	filterColumnKey,
}: DataTableSrandardToolbarProps<TData>) {
	return (
		<DataTableToolbarWrapper>
			<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
			<DataTableViewOptions table={table} />
		</DataTableToolbarWrapper>
	);
}
