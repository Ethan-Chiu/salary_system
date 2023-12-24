import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
	isNumber,
	isDate,
	isString,
} from "../develop_parameters/utils/checkType";
import { useRouter } from "next/router";
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
import { Translate } from "../develop_parameters/utils/translation";

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

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

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
	formSchema,
	fieldConfig,
	original_data,
	updateFunction,
	createFunction,
	deleteFunction,
	returnPage,
	mode,
	disabled,
}: any) {
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	const router = useRouter();
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
			createFunction({
				...parsedValues.data,
			});
		}
		else {
			updateFunction({
				...parsedValues.data,
				id: original_data.id,
			});
		}
		returnPage(0);
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
		<AutoForm
			_defaultValues={original_data}
			values={values}
			onSubmit={(data) => {

			}}
			onValuesChange={setValues}
			formSchema={formSchema}
			fieldConfig={fieldConfig}
		>
			<Button className="hidden" ref={buttonRef}>
				Submit
			</Button>

			<div className="grid grid-cols-6 gap-3">
				<div>
					<Button
						variant={"outline"}
						onClick={() => {
							console.log("Cancel");
							returnPage(0);
						}}
					>
						Cancel
					</Button>
				</div>
				{mode==="update" && <Button
					className="col-start-5"
					variant={"destructive"}
					onClick={() => {
						console.log("delete data id = %d", original_data.id);
						deleteFunction({ id: original_data.id });
						returnPage(0);
					}}
					disabled={disabled}
				>
					Delete
				</Button>}
				<p
					onClick={() => {
						handleSubmit();
						// setOpenDialog(true);
					}}
					className="col-start-6 mb-2 me-2 cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
							<Button
								onClick={() => {
									submitForm();
								}}
								type="submit"
							>
								Save changes
							</Button>
							<DialogClose />
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AutoForm>
	);
}
