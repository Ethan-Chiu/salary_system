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



export type SettingItem = {
	name: string;
	// type: "boolean" | "list" | "number" | "input"
	value: number | string;
	status: "pending" | "processing" | "success" | "failed";
};

export function find_index(table_name: string, table_names: String[]) {
	for (var i = 0; i < table_names.length; i++) {
		if (table_name == table_names[i]) return i;
	}
	return -1;
}

export function initializeEmptyArray(length: number) {
	let datas = [];
	for (var i = 0; i < length; i++) {if (datas.length < length) datas.push([]);}
	return datas ; 
}

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
			var formatted = "";
			switch (typeof row.getValue("value")) {
				case "number":
					const amount = parseFloat(row.getValue("value"));
					// Format the amount as a dollar amount
					// formatted = new Intl.NumberFormat("en-US", {
					// 	style: "currency",
					// 	currency: "USD",
					// }).format(amount);
					formatted = amount.toString();
					break;
				case "string":
					formatted = row.getValue("value");
			}
			return <div className="text-center font-medium">{formatted}</div>;
		},
	},
	// {
	// 	accessorKey: "Last Modified",
	// 	header: "Last Modified",
	// 	cell: ({ row }: { row: Row<SettingItem> }) => (
	// 		<div className="capitalize">{row.getValue("???")}</div>
	// 	),
	// },
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const setting = row.original;

			return <CompDropdown setting={setting} />;
		},
	},
];

// const waitFetch = (dbQuery: any) => {
// 	while(!dbQuery.isFetched){continue}
// 	return 0;
// }



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


export function InsertDialog({
	name,
	data,
	showDialog,
	onOpenChange,
}: {
	name: string;
	data: any;
	showDialog: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Dialog open={showDialog} onOpenChange={onOpenChange} >
			<DialogContent className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}>
				<DialogHeader>
					<DialogTitle>
						Add Data to [Table] {name}
					</DialogTitle>
					<DialogDescription>{/* Description */}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						{
							data.map((ob: any, index: number) => {
								return	<>
								 			<Label htmlFor="value" className="text-right">{ob.name}</Label>
								 			<Input
												ref={inputRef}
												id="value"
												defaultValue={ob.value}
												type={
													Number.isInteger(ob.value)?"number": "value"}
												className="col-span-3"
											/></> 
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
