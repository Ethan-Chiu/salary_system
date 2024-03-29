import AutoForm from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Translate } from "~/lib/utils/translation";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import { useContext } from "react";
import ParameterToolbarFunctionsProvider, {
	parameterToolbarFunctionsContext,
} from "../components/function_sheet/parameter_functions_context";
import GeneralTable from "../components/function_sheet/general_table";
import { FieldConfig } from "~/components/ui/auto-form/types";
import { ParameterTableEnum } from "../parameter_tables";
import { useRouter } from "next/router";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	onClose: () => void;
}

function EmptyCreateForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	onClose,
}: ParameterFormProps<SchemaType>) {
	const mode = "create";
	const functions = useContext(parameterToolbarFunctionsContext);

	const createFunction = functions.createFunction!;

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape).map(([key, value]) => {
				if (value instanceof z.ZodDefault)
					return [key, value._def.defaultValue()];
				return [key, undefined];
			})
		);
	}

	function submitForm() {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			if (mode === "create") {
				createFunction.mutate({
					...parsedValues.data,
				});
			} else {
				new Error("No Implement");
			}
		} else {
			// TODO: Error element with toast
		}
		onClose();
	}

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	// Create or update an entry
	return (
		<>
			<AutoForm
				className="m-5"
				_defaultValues={{}}
				values={formValues}
				onValuesChange={setFormValues}
				onSubmit={handleSubmit}
				formSchema={formSchema}
				fieldConfig={fieldConfig}
			>
				<div>
					<div className="flex justify-between">
						<Button
							type="button"
							variant={"outline"}
							onClick={() => {
								if (mode === "create") {
									onClose();
								}
							}}
						>
							Cancel
						</Button>

						<Button type="submit">
							{mode === "create" && "Create"}
						</Button>
					</div>
				</div>
			</AutoForm>
			{/* Submit change dialog */}
			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Are you sure to update?</DialogTitle>
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
		</>
	);
}

interface EmptyCreateProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	onClose: () => void;
	selectedTableType: ParameterTableEnum;
}

export function EmptyCreate<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	onClose,
	selectedTableType,
}: EmptyCreateProps<SchemaType>) {
	const router = useRouter();
	const [alertOpen, setAlertOpen] = useState(true);
	return (
		<>
			<ParameterToolbarFunctionsProvider
				selectedTableType={selectedTableType}
				period_id={0}
			>
				<AlertDialog
					open={alertOpen}
					onOpenChange={(open) => {
						if (!open) {
							void router.replace("/parameters");
						}
					}}
				>
					<div className="flex h-full flex-col p-4"></div>
					<AlertDialogContent className="w-[90vw]">
						<AlertDialogHeader>
							<AlertDialogTitle>
								No data in selected table.
							</AlertDialogTitle>
							<AlertDialogDescription>
								Please create one first.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<div className="m-4"></div>
						<AlertDialogFooter>
							<Dialog>
								<DialogTrigger asChild>
									<AlertDialogAction>
										Create
									</AlertDialogAction>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<EmptyCreateForm
										formSchema={formSchema}
										fieldConfig={fieldConfig}
										onClose={onClose}
									/>
								</DialogContent>
							</Dialog>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</ParameterToolbarFunctionsProvider>
		</>
	);
}
