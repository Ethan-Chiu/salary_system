import { cn } from "~/lib/utils";
import { useState } from "react";
import { LucideIcon, PenSquare, Plus, PlusSquare, Trash2 } from "lucide-react";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";

import { ParameterForm } from "./function_sheet/parameter_form";
import { getSchema } from "../Schemas/schemas";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	table_name: string;
}

type FunctionMode = "create" | "update" | "delete" | "none";

export function DataTableFunctions({
	table_name,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean | undefined>(undefined);
	const [mode, setMode] = useState<FunctionMode>("none");

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={open}>
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
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>Functions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<CompTriggerItem mode={"update"} itemName="Update" icon={PenSquare}/>
						<CompTriggerItem mode={"create"} itemName="Create" icon={Plus}/>
						<CompTriggerItem mode={"delete"} itemName="Delete" icon={Trash2}/>
					</DropdownMenuContent>
				</DropdownMenu>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{`${Translate(mode)!}${Translate("form")} (${table_name})`}
						</SheetTitle>
						<SheetDescription>
							{mode === "create"
								? "Fill in the parameters to create new table."
								: "Make changes to the table by modifying the parameters."}
						</SheetDescription>
					</SheetHeader>
					<ScrollArea className="h-[85%] w-full">
						<ParameterForm
							table_name={table_name}
							formSchema={getSchema(table_name)!(mode)}
							mode={mode}
							closeSheet={() => setOpen(false)}
						/>
						<ScrollBar orientation="horizontal" className="" />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	);

	function CompTriggerItem(props: {mode: FunctionMode, itemName: string, icon: LucideIcon}) {
		return <SheetTrigger
			className="w-full"
			onClick={() => {
				setMode(props.mode);
				setOpen(undefined);
			} }
		>
			<DropdownMenuItem className="cursor-pointer">
				<props.icon className="mr-2 h-4 w-4" />
				<span>{props.itemName}</span>
			</DropdownMenuItem>
		</SheetTrigger>;
	}
}
