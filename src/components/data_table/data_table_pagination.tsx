import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface DataTablePaginationProps<TData>
	extends React.HTMLAttributes<HTMLDivElement> {
	table: Table<TData>;
	setDataPerRow: (dataPerRow: number) => void;
}

export function DataTablePagination<TData>({
	table,
	setDataPerRow,
	className,
}: DataTablePaginationProps<TData>) {
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const dataNum = table.getFilteredRowModel().rows.length;
	const [rowNum, setRowNum] = React.useState(10);
	const [columnNum, setColumnNum] = React.useState(1);

	const { t } = useTranslation(['common']);

	return (
		<div
			className={cn(
				"flex flex-wrap items-center justify-end gap-y-1 p-2",
				className
			)}
		>
			{/* Showing results */}
			<div className="text-sm text-muted-foreground">
				{
					<div className="min-w-[100px]">
						{t('others.data_num_template')
							.replace('$1', (pageIndex * pageSize + 1).toString())
							.replace('$2', (Math.min((pageIndex + 1) * pageSize, dataNum)).toString())
							.replace('$3', (dataNum).toString())}
					</div>
				}
			</div>
			{/* Select data layout */}
			<div className="mx-2 flex flex-1 items-center justify-center text-sm text-muted-foreground">
				<Select
					defaultValue="10"
					onValueChange={(value) => {
						setRowNum(Number(value));
						table.setPageSize(columnNum * Number(value));
					}}
				>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Data Per Row" />
					</SelectTrigger>
					<SelectContent>
						{Array.from({ length: 10 }, (_, i) => i).map(
							(value) => (
								<SelectItem
									key={value}
									value={(value + 1).toString()}
								>
									{t('others.row_template')
										.replace('$1', (value + 1).toString())}
								</SelectItem>
							)
						)}
					</SelectContent>
				</Select>
				<div className="w-2" />
				<Select
					defaultValue="1"
					onValueChange={(value) => {
						setColumnNum(Number(value));
						setDataPerRow(Number(value));
						table.setPageSize(rowNum * Number(value));
					}}
				>
					<SelectTrigger className="w-36">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{Array.from({ length: 5 }, (_, i) => i).map((value) => (
							<SelectItem
								key={value}
								value={(value + 1).toString()}
							>
								{t('others.col_template')
									.replace('$1', (value + 1).toString())}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{/* Pagination */}
			<div className="ml-2 flex justify-end">
				<div className=" flex items-center space-x-4">
					<div className="flex w-30 items-center justify-center text-sm font-medium">
						{t('others.page_template')
							.replace('$1', (table.getState().pagination.pageIndex + 1).toString())
							.replace('$2', (table.getPageCount()).toString())}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeftIcon className="h-4 w-4" />
							{t("button.previous_page")}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							{t("button.next_page")}
							<ChevronRightIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
