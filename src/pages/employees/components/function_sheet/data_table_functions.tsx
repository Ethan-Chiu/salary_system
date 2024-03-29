import { cn } from "~/lib/utils";
import { useState } from "react";
import {
	LucideIcon,
	PenSquare,
	Plus,
	PlusSquare,
	RefreshCcw,
	Trash2,
} from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import {
	TableEnum,
	getTableName,
} from "~/pages/parameters/components/context/data_table_enum";
import { EmployeeForm } from "./employee_form";
import { getSchema } from "~/pages/parameters/schemas/get_schemas";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	tableType: TableEnum;
}

export type FunctionMode =
	| "create"
	| "update"
	| "delete"
	| "auto calculate"
	| "none";

export function DataTableFunctions({
	tableType,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={open} onOpenChange={setOpen}>
				{/* Dropdown */}
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto hidden h-8 lg:flex"
						>
							<PlusSquare className="cursor-pointer stroke-[1.5]" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[150px]">
						<DropdownMenuLabel>Functions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem
							mode={"update"}
							itemName="Update"
							icon={PenSquare}
						/>
						<CompTriggerItem
							mode={"create"}
							itemName="Create"
							icon={Plus}
						/>
						<CompTriggerItem
							mode={"delete"}
							itemName="Delete"
							icon={Trash2}
						/>
						<CompTriggerItem
							mode={"auto calculate"}
							itemName="Auto Calculate"
							icon={RefreshCcw}
						/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{`${Translate(mode)!}${Translate(
								"form"
							)} (${getTableName(tableType)})`}
						</SheetTitle>
						<SheetDescription>
							{mode === "create"
								? "Fill in the parameters to create new table."
								: "Make changes to the table by modifying the parameters."}
						</SheetDescription>
					</SheetHeader>
					<ScrollArea className="h-[85%] w-full">
						<EmployeeForm
							formSchema={getSchema(tableType)!}
							mode={mode}
							closeSheet={() => setOpen(false)}
						/>
						<ScrollBar orientation="horizontal" />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);

	function CompTriggerItem(props: {
		mode: FunctionMode;
		itemName: string;
		icon: LucideIcon;
	}) {
		return (
			<SheetTrigger
				className="w-full"
				onClick={() => {
					setMode(props.mode);
					setOpen(true);
				}}
			>
				<DropdownMenuItem className="cursor-pointer">
					<props.icon className="mr-2 h-4 w-4" />
					<span>{props.itemName}</span>
				</DropdownMenuItem>
			</SheetTrigger>
		);
	}
}
