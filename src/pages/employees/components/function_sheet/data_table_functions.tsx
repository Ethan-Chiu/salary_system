import { cn } from "~/lib/utils";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import {
	type TableEnum,
	getTableNameKey,
} from "~/pages/employees/components/context/data_table_enum";
import { EmployeeForm } from "./employee_form";
import { getSchema } from "~/pages/employees/schemas/get_schemas";
import { modeDescription } from "~/lib/utils/helper_function";
import { ConfirmDialog } from "./confirm_dialog";

interface DataTableFunctionsProps extends HTMLAttributes<HTMLDivElement> {
  openSheet: boolean,
  setOpenSheet: (open: boolean) => void,
  mode: string; // TODO:
	tableType: TableEnum; // NOTE: why pass it as argument
}

export function DataTableFunctions({
  openSheet,
  setOpenSheet,
	tableType,
  mode,
	className,
}: PropsWithChildren<DataTableFunctionsProps>) {


	const { t } = useTranslation(["common", "nav"]);

/* open && mode !== "delete" */

	return (
		<div className={cn(className, "flex h-full items-center")}>
			<Sheet open={openSheet} onOpenChange={setOpenSheet}>
				{/* Sheet */}
				<SheetContent className="w-[50%]">
					{/* {mode !== "none" && ( */}
						{/* <> */}
							<SheetHeader>
								<SheetTitle>
									{`${t(`button.${mode}`)!}${t(
										"button.form"
									)} (${t(getTableNameKey(tableType))})`}
								</SheetTitle>
								<SheetDescription>
									{modeDescription(t, mode)}
								</SheetDescription>
							</SheetHeader>
							<ScrollArea className="h-full w-full">
								<EmployeeForm
									formSchema={getSchema(tableType)!}
									formConfig={[
										{ key: "id", config: { hidden: true } },
									]}
									mode={mode}
									closeSheet={() => setOpenSheet(false)}
								/>
								<ScrollBar orientation="horizontal" />
							</ScrollArea>
						{/* </> */}
					{/* )} */}
				</SheetContent>
				{/* <ConfirmDialog */}
				{/* 	open={openSheet && mode === "delete"} */}
				{/* 	onOpenChange={setOpenSheet} */}
				{/* 	schema={getSchema(tableType)!} */}
				{/* /> */}
			</Sheet>
		</div>
	);
}

