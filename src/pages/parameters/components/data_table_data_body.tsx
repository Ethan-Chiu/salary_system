import { Table } from "@tanstack/react-table";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface DataTableDataBodyProps<TData> {
	table: Table<TData>;
}

export function DataTableDataBody<TData>({
	table,
}: DataTableDataBodyProps<TData>) {
	return (
		<TableBody>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row) => (
					<TableRow
						key={row.id}
						data-state={row.getIsSelected() && "selected"}
					>
						{row.getVisibleCells().map((cell) => (
							<TableCell
								key={cell.id}
								align="center"
								className="max-w-xs"
							>
								{flexRender(
									cell.column.columnDef.cell,
									cell.getContext()
								)}
							</TableCell>
						))}
					</TableRow>
				))
			) : (
				<CompNoTableRow cols={table.getAllColumns().length} />
			)}
		</TableBody>
	);
}

function CompNoTableRow({ cols }: { cols: number }) {
	return (
		<TableRow>
			<TableCell colSpan={cols} className="h-24 max-w-xs text-center">
				No results.
			</TableCell>
		</TableRow>
	);
}
