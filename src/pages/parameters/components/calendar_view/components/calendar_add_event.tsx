import React, { useContext } from "react";
import calendarContext from "../context/calendar_context";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { ParameterForm } from "../../function_sheet/parameter_form";
import dataTableContext from "../../context/data_table_context";
import { getTableName } from "../../context/data_table_enum";
import { getSchema } from "~/pages/parameters/schemas/get_schemas";
import { Translate } from "~/lib/utils/translation";

export default function CalendarAddEvent() {
	const { openSheet, mouseDownDate, mouseUpDate, setOpenSheet, resetMouse } =
		useContext(calendarContext);
	const { selectedTableType } = useContext(dataTableContext);

	const mode = "create";

	return (
		<Sheet
			open={openSheet}
			onOpenChange={(open: boolean) => {
				setOpenSheet(open);
				resetMouse();
			}}
		>
			<SheetContent className="w-[50%]">
				<SheetHeader>
					<SheetTitle>
						{`${Translate(mode)!}${Translate(
							"form"
						)} (${getTableName(selectedTableType)})`}
					</SheetTitle>
					<SheetDescription>
						{mode === "create"
							? "Fill in the parameters to create new table."
							: "Make changes to the table by modifying the parameters."}
					</SheetDescription>
				</SheetHeader>
				<ScrollArea className="h-[85%] w-full">
					<ParameterForm
						formSchema={getSchema(selectedTableType)!}
						mode={mode}
						closeSheet={() => {
							setOpenSheet(false);
							resetMouse();
						}}
						fieldConfig={{
							start_date: {
								inputProps: {
									defaultValue:
										mouseDownDate?.toDate() ?? undefined,
								},
							},
							end_date: {
								inputProps: {
									defaultValue:
										(mouseUpDate?.toDate() as any) ??
										undefined,
								},
							},
						}}
					/>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
