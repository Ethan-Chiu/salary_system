import { Table } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface DataTableDataHeaderProps<TData> {
	table: Table<TData>;
}

export function DataTableDataHeader<TData>({
	table,
}: DataTableDataHeaderProps<TData>) {
	return (
		<TableHeader className="bg-secondary">
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow
					key={headerGroup.id}
					className="sticky top-0 bg-secondary hover:bg-secondary"
				>
					{headerGroup.headers.map((header) => {
						return (
							<TableHead key={header.id} colSpan={header.colSpan}>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext()
									  )}
							</TableHead>
						);
					})}
				</TableRow>
			))}
		</TableHeader>
	);
}
