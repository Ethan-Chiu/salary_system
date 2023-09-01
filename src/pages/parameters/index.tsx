import { RootLayout } from "~/components/layout";
import { Sidebar } from "~/components/sidebar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Label } from "~/components/ui/label";

import * as React from "react";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	Row,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "~/components/ui/dialog";

import {
	Dialog as ShadcnDialog,
	DialogContent as ShadcnDialogContent,
	DialogDescription as ShadcnDialogDescription,
	DialogFooter as ShadcnDialogFooter,
	DialogHeader as ShadcnDialogHeader,
	DialogTitle as ShadcnDialogTitle,
	DialogTrigger as ShadcnDialogTrigger,
	DialogClose as ShadcnDialogClose,
} from "~/components/ui/dialog";
import { TableForeignKey } from "typeorm";
import { NextPageWithLayout } from "../_app";
import { SidebarLayout } from "~/components/sidebar_layout";

export type SettingItem = {
	name: string;
	// type: "boolean" | "list" | "number" | "input"
	value: number;
	status: "pending" | "processing" | "success" | "failed";
};

const data: SettingItem[] = [
	{
		name: "derv1ws0",
		value: 837,
		status: "processing",
	},
	{
		name: "5kma53ae",
		value: 874,
		status: "success",
	},
	{
		name: "bhqecj4p",
		value: 721,
		status: "failed",
	},
];

export const columns: ColumnDef<SettingItem>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Setting
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="pl-4 lowercase">{row.getValue("name")}</div>
		),
	},
	{
		accessorKey: "value",
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("value"));

			// Format the amount as a dollar amount
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div className="text-center font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "Last Modified",
		header: "Last Modified",
		cell: ({ row }: { row: Row<SettingItem> }) => (
			<div className="capitalize">{row.getValue("???")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const setting = row.original;

			const [dialogState, setDialogState] = React.useState(false);
			const inputRef = React.useRef<HTMLInputElement>(null);

			React.useEffect(() => {
				if (inputRef.current != null) {
					inputRef.current.focus();
				}
			}, []);

			return (
				<ShadcnDialog>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									void (async () => {
										await navigator.clipboard.writeText(
											setting.value.toString()
										);
									})();
								}}
							>
								Copy Value
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<ShadcnDialogTrigger>
								<DropdownMenuItem
									onClick={() => {
										setDialogState(true);
									}}
								>
									Modify
								</DropdownMenuItem>
							</ShadcnDialogTrigger>
						</DropdownMenuContent>
					</DropdownMenu>
					<ShadcnDialogContent>
						<ShadcnDialogHeader>
							<ShadcnDialogTitle>
								Modify the value of {setting.name}
							</ShadcnDialogTitle>
							<ShadcnDialogDescription>
								{/* Description */}
							</ShadcnDialogDescription>
						</ShadcnDialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="value" className="text-right">
									Value
								</Label>
								<Input
									ref={inputRef}
									id="value"
									defaultValue={setting.value.toString()}
									type={
										Number.isInteger(setting.value)
											? "number"
											: "value"
									}
									className="col-span-3"
								/>
							</div>
						</div>
						<ShadcnDialogFooter>
							<ShadcnDialogClose asChild>
								<Button
									type="submit"
									onClick={() => {
										let newParameterValue = Number(
											inputRef.current?.value
										);
										console.log(newParameterValue);
									}}
								>
									Save changes
								</Button>
							</ShadcnDialogClose>
						</ShadcnDialogFooter>
					</ShadcnDialogContent>
				</ShadcnDialog>
			);
		},
	},
];

const PageParameters: NextPageWithLayout = () => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<>
			{/* header */}
			<div className="my-4">
				<h2 className="text-2xl font-semibold tracking-tight">
					Parameters
				</h2>
			</div>
			<Separator />
			{/* top bar */}
			<div className="flex items-center py-6">
				{/* search bar */}
				<Input
					placeholder="Filter setting..."
					value={
						(table.getColumn("name")?.getFilterValue() as string) ??
						""
					}
					onChange={(event) =>
						table
							.getColumn("name")
							?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				{/* select column to show */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{/* table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{/* buttons */}
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</>
	);
};

PageParameters.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<SidebarLayout pageTitle="parameters">{page}</SidebarLayout>
		</RootLayout>
	);
};

export default PageParameters;
