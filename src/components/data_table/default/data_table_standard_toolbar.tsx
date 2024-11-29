import { type Table } from "@tanstack/react-table";
import { DataTableToolbarWrapper } from "../toolbar/data_table_toolbar_wrapper";
import { DataTableViewOptions } from "../toolbar/data_table_view_options";
import { ToolbarFilter } from "../toolbar/toolbar_filter";
import { StatsPanel } from "../toolbar/stats_panel";

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
			<div className="flex">
				<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
				<StatsPanel table={table} />
			</div>
			<div className="flex">
				<DataTableViewOptions table={table} />
			</div>
		</DataTableToolbarWrapper>
	);
}
