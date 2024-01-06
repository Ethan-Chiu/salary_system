import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
	isNumber,
	isDate,
	isString,
} from "~/pages/develop_parameters/utils/checkType";
import { useState, useRef } from "react";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Translate } from "~/pages/develop_parameters/utils/translation";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";

import { SheetClose } from "~/components/ui/sheet";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { useContext } from "react";
import { FunctionsContext } from "./Contexts";


const simpleTable = (d: any) => {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="whitespace-nowrap text-center">
						{"Key"}
					</TableHead>
					<TableHead className="whitespace-nowrap text-center">
						{"Value"}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Object.keys(d).map((key: string, index: number) => {
					return (
						<TableRow key={index.toString()}>
							<TableCell className="text-center font-medium">
								{Translate(key)}
							</TableCell>
							<TableCell className="text-center font-medium">
								{isDate(d[key])
									? d[key].toISOString().split("T")[0]
									: d[key]}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

export function ParameterForm({
	table_name,
	formSchema,
	fieldConfig,
	mode,
	closeSheet,
	disabled,
}: any) {

	const functions: any = useContext(FunctionsContext);

	const queryFunction = functions![table_name]?.queryFunction;
	const updateFunction = functions![table_name]?.updateFunction;
	const createFunction = functions![table_name]?.createFunction;
	const deleteFunction = functions![table_name]?.deleteFunction;

	const original_data = queryFunction.data;


	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [values, setValues] = useState<Partial<z.infer<typeof formSchema>>>(
		getDefaults(formSchema)
	);
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
		const parsedValues = formSchema.safeParse(values);
		if (mode === "create") {
			createFunction.mutate({
				...parsedValues.data,
			});
		}
		else {
			updateFunction.mutate({
				...parsedValues.data,
				id: original_data.id,
			});
		}
		closeSheet();
	}

	const handleSubmit = () => {
		// Trigger button click programmatically
		if (buttonRef.current) {
			buttonRef.current.click();
		}
		const parsedValues = formSchema.safeParse(values);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	return (
		<AutoForm className="m-5"
			_defaultValues={original_data?(original_data):{}}
			values={values}
			onSubmit={(data) => {}}
			onValuesChange={setValues}
			formSchema={formSchema}
			fieldConfig={fieldConfig}
		>
			<Button className="hidden" ref={buttonRef}>
				Submit
			</Button>

			<div className="grid grid-cols-3 gap-3">
				<div>
					<Button
						variant={"outline"}
						onClick={() => {
							console.log("Cancel");
						}}
					>
						Cancel
					</Button>
				</div>

				<p
					onClick={() => {
						console.log(values);
						handleSubmit();
						// setOpenDialog(true);
					}}
					className="col-start-3 mb-2 me-2 cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					{mode==="create" && "Create"}
					{mode==="update" && "Update"}
				</p>
				<Dialog open={openDialog} onOpenChange={setOpenDialog}>
					<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Are you sure to update?</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
						{simpleTable(values)}
						<DialogFooter>
							<DialogClose>
							<Button
								onClick={() => {
									submitForm();
								}}
								type="submit"
							>
								Save changes
							</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AutoForm>
	);
}
