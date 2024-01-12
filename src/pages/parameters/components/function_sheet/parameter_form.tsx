import AutoForm, { AutoFormSubmit } from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { isDate } from "~/lib/utils/checkType";
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
import { Translate } from "~/lib/utils/translation";

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
import { PenSquare, Trash2 } from "lucide-react";

import { useContext } from "react";
import { FunctionsContext } from "./functions_context";

function CompSimpleTable({ data }: { data: any }) {
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
				{Object.keys(data).map((key: string, index: number) => {
					return (
						<TableRow key={index.toString()}>
							<TableCell className="text-center font-medium">
								{Translate(key)}
							</TableCell>
							<TableCell className="text-center font-medium">
								{isDate(data[key])
									? data[key].toISOString().split("T")[0]
									: data[key]}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

interface ParameterFormProps {
	table_name: string;
	formSchema: any; // Replace 'any' with the specific type for formSchema
	fieldConfig?: any; // Replace 'any' with the specific type for fieldConfig
	mode: string;
	closeSheet: () => void;
}

export function ParameterForm({
	table_name,
	formSchema,
	fieldConfig,
	mode,
	closeSheet,
}: ParameterFormProps) {
	const functions = useContext(FunctionsContext);
	const queryFunction = functions![table_name]?.queryFunction;
	const updateFunction = functions![table_name]?.updateFunction;
	const createFunction = functions![table_name]?.createFunction;
	const deleteFunction = functions![table_name]?.deleteFunction;
	const isList = Array.isArray(queryFunction.data);
	const onlyOne = !(isList && queryFunction.data.length > 1);

	const [originalData, setOriginalData] = useState(
		isList ? null : queryFunction.data
	);

	const ViewAllDatas = () => {
		const noIDData: any[] = queryFunction.data.map((item: any) => {
			const { ["id"]: id, ...rest } = item;
			return rest;
		});

		return (
			<>
				{noIDData ? (
					<div className="m-4">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="whitespace-nowrap text-center">
										{""}
									</TableHead>
									{noIDData[0] &&
										Object.keys(noIDData[0]).map(
											(key: string) => {
												return (
													<TableHead className="whitespace-nowrap text-center">
														{Translate(key)}
													</TableHead>
												);
											}
										)}
									{!noIDData[0] && (
										<TableCell
											colSpan={5}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{noIDData?.map((data: any, index: number) => {
									return (
										<TableRow key={data.id}>
											<TableCell className="items-center">
												{mode === "update" && (
													<PenSquare
														size={18}
														className="cursor-pointer"
														onClick={() => {
															setOriginalData(
																queryFunction
																	.data[index]
															);
														}}
													/>
												)}
												{mode === "delete" && (
													<Trash2
														size={18}
														className="cursor-pointer"
														onClick={() => {
															deleteFunction.mutate(
																{
																	id: queryFunction
																		.data[
																		index
																	].id,
																}
															);
														}}
													/>
												)}
											</TableCell>
											{Object.keys(data).map((key) => {
												return (
													<TableCell className="text-center font-medium">
														{data[key]}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				) : (
					<></>
				)}
			</>
		);
	};

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
		} else {
			updateFunction.mutate({
				...parsedValues.data,
				id: originalData.id,
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

	if (mode === "delete" && onlyOne)
		return (
			<p>
				There's only one data left. Please create a new one before you
				continue to delete.
			</p>
		);

	if (originalData === null && mode !== "create") {
		return <ViewAllDatas />;
	}

	return (
		<AutoForm
			className="m-5"
			_defaultValues={
				originalData && mode === "update" ? originalData : {}
			}
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
							closeSheet();
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
					{mode === "create" && "Create"}
					{mode === "update" && "Update"}
				</p>
				<Dialog open={openDialog} onOpenChange={setOpenDialog}>
					<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Are you sure to update?</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
						<CompSimpleTable data={values} />
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
