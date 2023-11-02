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
import { columns } from "./backup";


export type BankRow = {
	id: number;
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



function DeleteRow(id: number) {
	console.log("delete bank setting whose id = %d", id)
}


function CompDropdown({ setting }: { setting: BankRow }) {
	const [showModifyDialog, setShowModifyDialog] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	
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
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setShowModifyDialog(true);
						}}
					>
						Modify
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => {
							setShowDeleteDialog(true);
						}}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CompDialog
				setting={setting}
				showDialog={showModifyDialog}
				onOpenChange={(open: boolean) => {
					setShowModifyDialog(open);
				}}
			/>

			<ConfirmDialog
				showDialog={showDeleteDialog}
				setting={setting}
				message="Are you sure you want to proceed?"
				title="Confirmation" 
				onOpenChange={(open: boolean) => {
					setShowDeleteDialog(open);
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
	const [updatedSetting, setUpdatedSetting] = useState(setting);
	const handleInputChange = (key: any, value: any) => {
		setUpdatedSetting((prevSetting: any) => ({
		  ...prevSetting,
		  [key]: value
		}));
	};
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
										id={key}
										defaultValue={value}
										type={Number.isInteger(value)?"number": "value"}
										className="col-span-3"
										onChange={e => handleInputChange(key, e.target.value)}
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
								console.log(setting)
								console.log(updatedSetting)
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


function ConfirmDialog({
	title,
	message,
	setting,
	showDialog,
	onOpenChange,
}: {
	title: string;
	message: string;
	setting: BankRow;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{title}
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
						{message}
				</div>
				<DialogFooter>
					<DialogClose>
						<Button onClick={()=>{console.log("no delete")}}>
							No
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button onClick={()=>{DeleteRow(setting.id)}}>
							Yes
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}