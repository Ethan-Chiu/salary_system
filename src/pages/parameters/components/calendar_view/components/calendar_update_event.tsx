import React, { useContext, useState } from "react";
import calendarContext from "../context/calendar_context";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import dataTableContext from "../../context/data_table_context";
import { getTableName } from "../../context/data_table_enum";
import { getSchema } from "~/pages/parameters/schemas/get_schemas";
import { Translate } from "~/lib/utils/translation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import AutoForm from "~/components/ui/auto-form";
import GeneralTable from "../../function_sheet/general_table";
import { z } from "zod";
import { toolbarFunctionsContext } from "../../function_sheet/functions_context";

interface CalendarUpdateEventProps<SchemaType extends z.AnyZodObject> {}

export default function CalendarUpdateEvent<
	SchemaType extends z.AnyZodObject
>({}: CalendarUpdateEventProps<SchemaType>) {
	const { updateSheet, setUpdateSheet, resetMouse, selectedEvent } =
		useContext(calendarContext);

	const mutateFunctions = useContext(toolbarFunctionsContext);
	const updateFunction = mutateFunctions.updateFunction!;

	const { selectedTableType } = useContext(dataTableContext);
	const formSchema = getSchema(selectedTableType);

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape as Record<string, any>).map(([key, value]) => {
				if (value instanceof z.ZodDefault)
					return [key, value._def.defaultValue()];
				return [key, undefined];
			})
		);
	}

	const mode = "update";

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	function submitForm() {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			updateFunction.mutate({
				...parsedValues.data,
				id: selectedEvent?.getData().id,
			});
		} else {
			// TODO: Error element with toast
		}
		setUpdateSheet(false);
	}

	return (
		<Sheet
			open={updateSheet}
			onOpenChange={(open: boolean) => {
				setUpdateSheet(open);
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
						{
							"Make changes to the table by modifying the parameters."
						}
					</SheetDescription>
				</SheetHeader>
				<ScrollArea className="h-[85%] w-full">
					<AutoForm
						className="m-5"
						_defaultValues={selectedEvent?.getData()}
						values={formValues}
						onValuesChange={setFormValues}
						onSubmit={handleSubmit}
						formSchema={formSchema}
					>
						<div>
							<div className="my-16 flex justify-between">
								<Button
									type="button"
									variant={"outline"}
									onClick={() => {
										setUpdateSheet(false);
									}}
								>
									Cancel
								</Button>

								<Button type="submit">Update</Button>
							</div>
						</div>
					</AutoForm>
					{/* Submit change dialog */}
					<Dialog open={openDialog} onOpenChange={setOpenDialog}>
						<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>
									Are you sure to update?
								</DialogTitle>
								<DialogDescription></DialogDescription>
							</DialogHeader>
							<GeneralTable data={formValues} />
							<DialogFooter>
								<DialogClose asChild>
									<Button onClick={submitForm} type="submit">
										Save changes
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
