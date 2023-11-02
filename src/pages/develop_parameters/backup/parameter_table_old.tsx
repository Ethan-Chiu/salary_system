import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import type {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	Row,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Settings } from "lucide-react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "~/components/ui/dialog";
import { type ReactElement, useRef, useState, useEffect } from "react";

// type: "boolean" | "list" | "number" | "input"
export type SettingItem = {
	name: string;
	value: number | string;
};

export const columns1: ColumnDef<SettingItem>[] = [
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
		cell: ({ row }) => (<div className="pl-4 lowercase">{row.getValue("name")}</div>),
	},
	{
		accessorKey: "value",
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			var formatted = "";
			switch (typeof row.getValue("value")) {
				case "number":	formatted = parseFloat(row.getValue("value")).toString(); break;
				case "string":	formatted = row.getValue("value");	break;
			}
			return <div className="text-center font-medium">{formatted}</div>;
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

export const columns2: ColumnDef<SettingItem>[] = [
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
					Test
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (<div className="pl-4 lowercase">{row.getValue("name")}</div>),
	},
	{
		accessorKey: "value",
		header: () => <div className="text-center">Test</div>,
		cell: ({ row }) => {
			var formatted = "";
			switch (typeof row.getValue("value")) {
				case "number":	formatted = parseFloat(row.getValue("value")).toString(); break;
				case "string":	formatted = row.getValue("value");	break;
			}
			return <div className="text-center font-medium">{formatted}</div>;
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




function CompDropdown({ setting }: { setting: SettingItem }) {
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
									setting.value.toString()
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
	setting: SettingItem;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Modify the value of {setting.name}
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
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