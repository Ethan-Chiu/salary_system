import { cn } from "~/lib/utils";
import { useContext, useState } from "react";
import { LayoutGrid, PenSquare, Plus } from "lucide-react";
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

import FunctionsProvider, { FunctionsContext } from "./function_sheet/Contexts"; // Correct import statement
import { ParameterForm } from "./function_sheet/ParameterForm";
import * as TN from "~/pages/table_names";
import { getSchema } from "~/pages/modify/Schemas/schemas";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

interface DataTableFunctionsProps extends React.HTMLAttributes<HTMLDivElement> {
	table_name: string;
}

export function DataTableFunctions({
	table_name,
	className,
}: DataTableFunctionsProps) {
	const [open, setOpen] = useState<boolean | undefined>(undefined);
	const [mode, setMode] = useState<"create" | "update" | "">("");
	console.log(table_name);

	return (
		<>
			<div className={cn(className)}>
				<Sheet open={open}>
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<div className="group relative">
								<div className="transform rounded-full transition duration-300 ease-in-out hover:scale-110 hover:bg-gray-200">
									{table_name && (
										<LayoutGrid
											strokeWidth={1}
											className="cursor-pointer"
										/>
									)}
								</div>
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-[80px]">
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
						</DropdownMenuContent>
					</DropdownMenu>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>{Translate(mode)! + Translate("form") + "(" + table_name + ")"}</SheetTitle>
							<SheetDescription>
								{(mode === "create") 
                                    ?"Fill in the parameters to create new table."
                                    :"Make changes to the table by modifying the parameters."}
							</SheetDescription>
						</SheetHeader>
						<br />
						<ScrollArea className="h-[85%] w-full">
							<FunctionsProvider>
								<ParameterForm
									table_name={table_name}
									formSchema={getSchema(table_name)!(mode)}
									mode={mode}
									closeSheet={() => setOpen(false)}
								/>
							</FunctionsProvider>
						</ScrollArea>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}
