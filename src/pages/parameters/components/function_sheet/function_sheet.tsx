import { useContext, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
import FunctionsProvider, { FunctionsContext } from "./Contexts"; // Correct import statement
import { ParameterForm } from "./ParameterForm";
import * as TN from "~/pages/table_names";
import { getSchema } from "~/pages/modify/Schemas/schemas";
import { ScrollArea } from "~/components/ui/scroll-area";
import { JsxElement } from "typescript";

interface FunctionSheetProps
	extends React.HTMLAttributes<HTMLDivElement> {
	table_name: string,
	TriggerElement?: any,
	mode: string,
}



export function FunctionSheetContent({TriggerElement, table_name, mode }: FunctionSheetProps): any {
	const [open, setOpen] = useState<boolean | undefined>(undefined);
	mode = "update";

	return (
		<>
			<Sheet open={open}>
				<SheetTrigger asChild>
					{	TriggerElement ? 
						<Button variant={"ghost"} onClick={
							() => {
								setOpen(undefined);
							}}>
						<TriggerElement/>
						</Button>
						:<Button variant="outline" onClick={() => setOpen(undefined)}>Edit</Button>
					}
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Modify {table_name}</SheetTitle>
						<SheetDescription>
							Make changes to the table here.
						</SheetDescription>
					</SheetHeader>
					<br />
					<ScrollArea className="h-[85%] w-full">
					<FunctionsProvider>
						<ParameterForm 
							table_name = {table_name}
							formSchema = {getSchema(table_name)!(mode)}
							mode = {mode}
							closeSheet = {() => setOpen(false)}
						/>
					</FunctionsProvider>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</>
	);
}
