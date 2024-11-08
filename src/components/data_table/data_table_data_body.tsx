import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { TableBody, TableCell, TableRow } from "~/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";

interface DataTableDataBodyProps<TData> {
	table: Table<TData>;
	dataPerRow: number;
	detailData?: any;
}

export function DataTableDataBody<TData>({
	table,
	dataPerRow,
	detailData,
}: DataTableDataBodyProps<TData>) {

	const [selectedDetailData, setSelectedDetailData] = useState<any>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const rows = table.getRowModel().rows;
	const groupedRows = [];
	for (let i = 0; i < rows.length; i += dataPerRow) {
		groupedRows.push(rows.slice(i, i + dataPerRow));
	}

	return (
		<TableBody>
			{groupedRows?.length ? (
				groupedRows.map((row, rowIdx) => (
					<TableRow
						key={row[0]!.id}
						data-state={row[0]!.getIsSelected() && "selected"}
						className={
							detailData
								? "cursor-pointer whitespace-nowrap"
								: "whitespace-nowrap"
						}
						onClick={() => {
							if (detailData) {
								setDialogOpen(true);
								setSelectedDetailData(detailData[rowIdx]);
							}
						}}
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
			<RowDialog />
		</TableBody>
	);

	function RowDialog() {

		return (
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Details</DialogTitle>
						<DialogDescription>
						</DialogDescription>
					</DialogHeader>

					<div>
						{selectedDetailData}
					</div>


					<DialogFooter></DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}
}

function CompNoTableRow({ cols }: { cols: number }) {
	const { t } = useTranslation(["common"]);
	return (
		<TableRow>
			<TableCell
				colSpan={cols}
				className="h-24 max-w-xs text-center font-medium"
			>
				{t("table.no_data")}
			</TableCell>
		</TableRow>
	);
}
