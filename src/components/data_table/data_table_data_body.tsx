import { type Table } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "~/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface DataTableDataBodyProps<TData> {
	table: Table<TData>;
	dataPerRow: number;
}

export function DataTableDataBody<TData>({
	table,
	dataPerRow,
}: DataTableDataBodyProps<TData>) {
	const rows = table.getRowModel().rows;
	const groupedRows = [];
	for (let i = 0; i < rows.length; i += dataPerRow) {
		groupedRows.push(rows.slice(i, i + dataPerRow));
	}
	return (
		<TableBody>
			{groupedRows?.length ? (
				groupedRows.map((row) => (
					<TableRow
						key={row[0]!.id}
						data-state={row[0]!.getIsSelected() && "selected"}
						className="whitespace-nowrap"
					>
						{row.map((data) =>
							data.getVisibleCells().map((cell) => (
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
							))
						)}
					</TableRow>
				))
			) : (
				<CompNoTableRow cols={table.getAllColumns().length} />
			)}
		</TableBody>
	);
}

function CompNoTableRow({ cols }: { cols: number }) {
	const { t } = useTranslation(['common'])
	return (
		<TableRow>
			<TableCell colSpan={cols} className="h-24 max-w-xs text-center">
				{t("table.no_data")}
			</TableCell>
		</TableRow>
	);
}
