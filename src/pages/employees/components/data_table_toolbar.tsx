import { type Table } from "@tanstack/react-table";
import { DataTableToolbarWrapper } from "~/components/data_table/toolbar/data_table_toolbar_wrapper";
import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { AdvancedFilter } from "./advanced_filter";

interface DataTableSrandardToolbarProps<TData> {
	table: Table<TData>;
	filterColumnKey?: keyof TData;
}
export function DataTableToolbar<TData>({
	table,
	filterColumnKey,
}: DataTableSrandardToolbarProps<TData>) {
	return (
		<DataTableToolbarWrapper>
			<div className="flex w-1/2">
				<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
				<AdvancedFilter table={table} />
			</div>
			<DataTableViewOptions table={table} />
		</DataTableToolbarWrapper>
	);
}
