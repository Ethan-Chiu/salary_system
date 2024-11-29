import * as React from "react";
import { type ColumnDef, type Table } from "@tanstack/react-table";

import { Separator } from "~/components/ui/separator";
import { DataTablePagination } from "~/components/data_table/data_table_pagination";
import { DataTableStandardBody } from "./data_table_standard_body";
import { WithDataTableStandardState } from "~/components/data_table/default/data_table_standard_state";
import { DataTableToolbarWrapper } from "~/components/data_table/toolbar/data_table_toolbar_wrapper";
import { ToolbarFilter } from "~/components/data_table/toolbar/toolbar_filter";
import { StatsPanel } from "~/components/data_table/toolbar/stats_panel";
import { DataTableViewOptions } from "~/components/data_table/toolbar/data_table_view_options";
import { AdvancedFilter } from "./advanced_filter";

interface DataTableProps<TData> {
	columns: ColumnDef<TData, any>[];
	data: TData[];
	filterColumnKey?: keyof TData;
	detailData?: any;
}

export function DataTable<TData>({
	columns,
	data,
	filterColumnKey,
	detailData,
}: DataTableProps<TData>) {
	return WithDataTableStandardState({
		columns: columns,
		data,
		props: { filterColumnKey, detailData },
		WrappedComponent: DataTableContent,
	});
}

function DataTableContent<TData>({
	table,
	filterColumnKey,
	detailData
}: {
	table: Table<TData>;
	filterColumnKey?: keyof TData;
	detailData?: any;
}) {
	const [dataPerRow, setDataPerRow] = React.useState(1);

	return (
		<div className="flex h-full w-full flex-col rounded-md border">
			<DataTableToolbarWrapper>
				<div className="flex">
					<ToolbarFilter table={table} filterColumnKey={filterColumnKey} />
					<StatsPanel table={table} />
				</div>
				<div className="flex">
					<AdvancedFilter table={table} />
					<DataTableViewOptions table={table} />
				</div>
			</DataTableToolbarWrapper>
			<Separator />
			<div className="h-0 flex-grow">
				<DataTableStandardBody table={table} dataPerRow={dataPerRow} detailData={detailData} />
			</div>
			<DataTablePagination
				table={table}
				setDataPerRow={setDataPerRow}
				className="bg-secondary"
			/>
		</div>
	);
}
