import { type Table as TableType } from "@tanstack/react-table";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Table } from "~/components/ui/table";
import { DataTableDataHeader } from "../data_table_data_header";
import { DataTableDataBody } from "../data_table_data_body";
import { cn } from "~/lib/utils";

interface DataTableSrandardBodyProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {
	table: TableType<TData>;
	dataPerRow?: number;
	detailData?: any;
}
export function DataTableStandardBody<TData>({
	table,
	dataPerRow = 10,
	className,
	detailData,
}: DataTableSrandardBodyProps<TData>) {
	return (
		<ScrollArea className="h-full">
			<Table className={cn("border-b-[1px]", className)}>
				<DataTableDataHeader table={table} dataPerRow={dataPerRow} />
				<DataTableDataBody table={table} dataPerRow={dataPerRow} detailData={detailData}/>
			</Table>
			<ScrollBar orientation="horizontal" hidden={true} />
		</ScrollArea>
	);
}
