import { cn } from "~/lib/utils";
import { useContext, useState } from "react";
import { LayoutGrid, PenSquare, Plus, PlusSquare, Trash2 } from "lucide-react";
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
import { Translate } from "~/lib/utils/translation";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	table_name: string;
}

export function DataTableFunctions({
	table_name,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean | undefined>(undefined);
	const [mode, setMode] = useState<"create" | "update" | "delete" | "">("");

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={open}>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<PlusSquare className="cursor-pointer stroke-[1.5]" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[120px]">
						<DropdownMenuLabel>Functions</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<SheetTrigger
							className="w-full"
							onClick={() => {
								setMode("update");
								setOpen(undefined);
							}}
						>
							<DropdownMenuItem className="cursor-pointer">
								<PenSquare className="mr-2 h-4 w-4" />
								<span>Update</span>
							</DropdownMenuItem>
						</SheetTrigger>
						<SheetTrigger
							className="w-full"
							onClick={() => {
								setMode("create");
								setOpen(undefined);
							}}
						>
							<DropdownMenuItem className="cursor-pointer">
								<Plus className="mr-2 h-4 w-4" />
								<span>Create</span>
							</DropdownMenuItem>
						</SheetTrigger>
						<SheetTrigger
							className="w-full"
							onClick={() => {
								setMode("delete");
								setOpen(undefined);
							}}
						>
							<DropdownMenuItem className="cursor-pointer">
								<Trash2 className="mr-2 h-4 w-4" />
								<span>Delete</span>
							</DropdownMenuItem>
						</SheetTrigger>
					</DropdownMenuContent>
				</DropdownMenu>
				<SheetContent className="w-[50%]">
					<SheetHeader>
						<SheetTitle>
							{Translate(mode)! +
								Translate("form") +
								"(" +
								table_name +
								")"}
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
}
