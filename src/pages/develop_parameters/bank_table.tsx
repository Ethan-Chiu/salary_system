import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	Row,
} from "@tanstack/react-table";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "~/components/ui/dialog";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { type ReactElement, useRef, useState, useEffect } from "react";
import { baseObjectInputType } from "zod";
import { set } from "react-hook-form";


export type BankRow = {
	bank_name: string;
	bank_code: string;
	org_name: string
	org_code: string;
}

export const bank_data_columns: ColumnDef<BankRow>[] = [
	{
		accessorKey: "bank_name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Bank
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="pl-4 lowercase">{`(${row.original.bank_code})${row.original.bank_name}`}</div>;
		},
	},
	{
		accessorKey: "org_name",
		header: () => <div className="text-center">Company</div>,
		cell: ({ row }) => {
			return <div className="text-center font-medium">{`(${row.original.org_code})${row.original.org_name}`}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const setting = row.original;
			return <CompDropdown setting={setting} />;
		},
	},
];


function CompDropdown({ setting }: { setting: BankRow }) {
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
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
									setting.bank_name.toString()
								);
							})();
						}}
					>
						Copy Value
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setShowDialog(true);
						}}
					>
						Modify
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CompDialog
				setting={setting}
				showDialog={showDialog}
				onOpenChange={(open: boolean) => {
					setShowDialog(open);
				}}
			/>
		</>
	);
}

function CompDialog({
	setting,
	showDialog,
	onOpenChange,
}: {
	setting: BankRow;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Modify
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						{
							Object.entries(setting).map(([key, value]) => {
								return <>
									<Label htmlFor="value" className="text-right">
										{key}
									</Label>
									<Input
										ref={inputRef}
										id={key}
										defaultValue={value}
										type={
											Number.isInteger(value)
												? "number"
												: "value"
										}
										className="col-span-3"
									/>
								</>
							})
						}
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							onClick={() => {
								const value = Number(inputRef.current?.value);
							}}
						>
							Save changes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}