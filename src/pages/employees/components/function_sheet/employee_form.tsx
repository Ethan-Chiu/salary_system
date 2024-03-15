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
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "~/components/ui/dialog";
import { PenSquare, Trash2 } from "lucide-react";

import { useContext } from "react";
import { FunctionMode } from "./data_table_functions";
import { LoadingSpinner } from "~/components/loading";
import { FieldConfig } from "~/components/ui/auto-form/types";
import { employeeToolbarFunctionsContext } from "./employee_functions_context";
import GeneralTable from "~/pages/parameters/components/function_sheet/general_table";
import { Input } from "~/components/ui/input";

interface EmployeeFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function EmployeeForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	mode,
	closeSheet,
}: EmployeeFormProps<SchemaType>) {
	const functions = useContext(employeeToolbarFunctionsContext);

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } = queryFunction();

	const isList = Array.isArray(data);
	const onlyOne = !(isList && data.length > 1);

	const [selectedData, setSelectedData] = useState(isList ? null : data);

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
			} else if (mode === "update") {
				updateFunction.mutate({
					...parsedValues.data,
					id: selectedData.id,
				});
			}
		} else {
			// TODO: Error element with toast
		}
		closeSheet();
	}

	const handleSubmit = () => {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			setOpenDialog(true);
		}
	};

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (mode === "delete" && onlyOne) {
		return (
			<p>
				There's only one data left. Please create a new one before you
				continue to delete.
			</p>
		);
	}

	// Select one entry
	if (mode !== "create" && selectedData === null) {
		const noIDData: any[] = data.map((item: any) => {
			const { ["id"]: id, ...rest } = item;
			return rest;
		});

		return (
			<CompViewAllDatas
				dataNoID={noIDData}
				mode={mode}
				onUpdate={(index: number) => {
					setSelectedData(data[index]);
				}}
				onDelete={(index: number) => {
					deleteFunction.mutate({
						id: data[index].id,
					});
				}}
			/>
		);
	}

	// Create or update an entry
	return (
		<>
			<AutoForm
				className="m-5"
				_defaultValues={mode === "create" ? {} : selectedData}
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
								if (mode === "update") {
									isList
										? setSelectedData(null)
										: closeSheet();
								}
								if (mode === "create") {
									closeSheet();
								}
							}}
						>
							Cancel
						</Button>

						<Button type="submit">
							{mode === "create" && "Create"}
							{mode === "update" && "Update"}
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

const CompViewAllDatas = ({
	dataNoID,
	mode,
	onUpdate,
	onDelete,
}: {
	dataNoID: any[];
	mode: FunctionMode;
	onUpdate: Function;
	onDelete: Function;
}) => {

	const [filterValue, setFilterValue] = useState<string>("");

	return (
		<>
			<Input className="w-1/10 m-2" placeholder={"請輸入搜尋關鍵字"} onChange={e => setFilterValue(e.target.value)}></Input>
			{dataNoID && (
				<div className="m-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap text-center"></TableHead>
								{dataNoID[0] ? (
									Object.keys(dataNoID[0]).map(
										(key: string) => {
											return (
												<TableHead
													key={key}
													className="whitespace-nowrap text-center"
												>
													{Translate(key)}
												</TableHead>
											);
										}
									)
								) : (
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
							{dataNoID?.filter((data: any) => {
								return Object.values(data).some((value: any) => value ? value.toString().includes(filterValue) : false)
							}).map((data: any, index: number) => {
								return (
									<TableRow key={data.id}>
										<TableCell className="items-center">
											{mode === "update" && (
												<PenSquare
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onUpdate(index);
													}}
												/>
											)}
											{mode === "delete" && (
												<Trash2
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onDelete(index);
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
			)}
		</>
	);
};
