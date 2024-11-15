import AutoForm from "~/components/ui/auto-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { useTranslation } from "react-i18next";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Copy, PenSquare, Trash2 } from "lucide-react";
import { useContext } from "react";
import { type FunctionMode } from "./data_table_functions";
import { LoadingSpinner } from "~/components/loading";
import { type FieldConfig } from "~/components/ui/auto-form/types";
import { employeeToolbarFunctionsContext } from "./employee_functions_context";
import GeneralTable from "~/pages/employees/components/function_sheet/general_table";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import periodContext from "~/components/context/period_context";
import { get_date_string } from "~/server/service/helper_function";
import { isDate } from "date-fns";
import { formatDate } from "~/lib/utils/format_date";

interface EmployeeFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	mode: FunctionMode;
	columns: any;
	closeSheet: () => void;
}

interface DataTypeWithoutID {
	emp_no: string;
}

interface DataType extends DataTypeWithoutID {
	id: number;
}

export function EmployeeForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	mode,
	columns,
	closeSheet,
}: EmployeeFormProps<SchemaType>) {
	const { t } = useTranslation(["common"]);
	const functions = useContext(employeeToolbarFunctionsContext);
	const { selectedPeriod } = useContext(periodContext);

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const autoCalculateFunction = functions.autoCalculateFunction!;
	const {
		isLoading,
		isError,
		data,
		error,
	}: {
		isLoading: boolean;
		isError: boolean;
		data?: DataType | DataType[];
		error?: { message: string } | null;
	} = queryFunction();

	const isList = Array.isArray(data);
	const onlyOne = !(isList && data.length > 1);

	const [selectedData, setSelectedData] = useState(isList ? null : data);

	const [formValues, setFormValues] = useState<
		Partial<z.infer<z.AnyZodObject>>
	>(getDefaults(formSchema));

	const [openDialog, setOpenDialog] = useState(false);

	function getDefaults<Schema extends z.AnyZodObject>(schema: Schema) {
		return Object.fromEntries(
			Object.entries(schema.shape as Record<string, any>).map(
				([key, value]) => {
					if (value instanceof z.ZodDefault)
						return [key, value._def.defaultValue()];
					return [key, undefined];
				}
			)
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
				if (!selectedData) {
					return;
				}
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
		return <span>Error: {error?.message}</span>; // TODO: Error element with toast
	}

	if (mode === "delete" && onlyOne) {
		return <p>{t("others.delete_warning")}</p>;
	}

	if (!data) {
		return <p>{t("others.no_data")}</p>;
	}

	// Select one entry
	if (isList && selectedData === null) {
		const noIDData: DataTypeWithoutID[] = data.map((item: any) => {
			const { ["id"]: id, ...rest } = item;
			return rest as DataTypeWithoutID;
		});

		return (
			<CompViewAllDatas
				dataNoID={noIDData}
				mode={mode}
				columns={columns}
				onUpdate={(emp_no: string) => {
					const selectedEmp = data.findLast(
						(d) => d.emp_no === emp_no
					);
					if (!selectedEmp) {
						return;
					}
					setSelectedData(selectedEmp);
				}}
				onDelete={(index: number) => {
					const selectedId = data[index]?.id;
					if (!selectedId) {
						return;
					}

					deleteFunction.mutate({
						id: selectedId,
					});
				}}
				onAutoCalculate={(selectedEmpNoList: string[], start_date: Date) => {
					closeSheet();
					autoCalculateFunction.mutate({
						emp_no_list: selectedEmpNoList,
						start_date: start_date,
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
				_defaultValues={selectedData}
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
							{t("button.cancel")}
						</Button>

						<Button type="submit">
							{mode === "create" && t("button.create")}
							{mode === "update" && t("button.update")}
						</Button>
					</div>
				</div>
			</AutoForm>

			<Dialog open={openDialog} onOpenChange={setOpenDialog}>
				<DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{t("others.check_data")}</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<GeneralTable data={formValues} />
					<DialogFooter>
						<DialogClose asChild>
							<Button onClick={submitForm} type="submit">
								{t("button.save")}
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
	columns,
	onUpdate,
	onDelete,
	onAutoCalculate,
}: {
	dataNoID: any[];
	mode: FunctionMode;
	columns?: any;
	onUpdate: (emp_no: string) => void;
	onDelete: (index: number) => void;
	onAutoCalculate: (selectedEmpNoList: string[], date: Date) => void;
}) => {
	const [filterValue, setFilterValue] = useState<string>("");
	const [filteredDataList, setFilteredDataList] =
		useState(dataNoID);
	const [selectedEmpNoList, setSelectedEmpNoList] = useState<string[]>(
		dataNoID.map((e) => e.emp_no)
	);
	const [date, setDate] = useState<Date>(new Date());

	useEffect(() => {
		const filteredData = dataNoID?.filter((data) => {
			return Object.values(data).some((value: any) =>
				value ? value.toString().includes(filterValue) : false
			);
		});
		setFilteredDataList(filteredData);
	}, [dataNoID, filterValue]);

	const { t } = useTranslation(["common"]);

	return (
		<>
			<div className="flex h-10 items-center justify-between">
				<Input
					className="w-1/10 absolute left-4 top-4"
					placeholder={t("others.filter_setting")}
					onChange={(e) => setFilterValue(e.target.value)}
				></Input>
				{mode == "auto_calculate" && (
					<Dialog>
						<DialogTrigger asChild>
							<Button className="absolute right-4 top-4">
								{t("button.auto_calculate")}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>
									{t("others.auto_calculate_confirm")}
								</DialogTitle>
								<DialogDescription>
									{t("others.confirm_msg")}
								</DialogDescription>
							</DialogHeader>
							<div className="flex flex-row items-center m-4">
								<div className="w-1/2 text-center">{t("others.new_data_start_date")}</div>
								<Input
									type="date"
									onChange={(e) => setDate(new Date(e.target.value))}
									defaultValue={get_date_string(date)}
								/>
							</div>
							<DialogFooter>
								<DialogClose>
									<Button
										onClick={() => onAutoCalculate(selectedEmpNoList, date)}
									>
										{t("button.confirm")}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
			</div>
			<div className="m-4">
				{filteredDataList.length != 0 && filteredDataList[0] ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap text-center">
									{mode == "auto_calculate" && (
										<Checkbox
											className="cursor-pointer"
											checked={
												selectedEmpNoList.length ===
												dataNoID.length
											}
											onCheckedChange={(checked) => {
												if (checked) {
													setSelectedEmpNoList(
														dataNoID.map(
															(e) => e.emp_no
														)
													);
												} else {
													setSelectedEmpNoList([]);
												}
											}}
										/>
									)}
								</TableHead>
								{(columns ?? Object.keys(filteredDataList[0])).map(
									(key: string) => {
										return (
											<TableHead
												key={key}
												className="whitespace-nowrap text-center"
											>
												{t(`table.${key}`)}
											</TableHead>
										);
									}
								)}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDataList.map((data, index: number) => {
								return (
									<TableRow key={data.emp_no}>
										<TableCell className="items-center">
											{mode === "create" && (
												<Copy
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onUpdate(data.emp_no);
													}}
												/>
											)}
											{mode === "update" && (
												<PenSquare
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onUpdate(data.emp_no);
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
											{mode === "auto_calculate" && (
												<Checkbox
													className="cursor-pointer"
													checked={selectedEmpNoList.includes(
														data.emp_no
													)}
													onCheckedChange={(
														checked
													) => {
														if (checked) {
															setSelectedEmpNoList(
																[
																	...selectedEmpNoList,
																	data.emp_no,
																]
															);
														} else {
															setSelectedEmpNoList(
																selectedEmpNoList.filter(
																	(empNo) =>
																		empNo !==
																		data.emp_no
																)
															);
														}
													}}
												/>
											)}
										</TableCell>
										{(columns ?? Object.keys(filteredDataList[0])).map((key: string) => {
											return (
												<TableCell
													key={key}
													className="whitespace-nowrap text-center font-medium"
												>
													{isDate(data[key]) ? formatDate("day", data[key]) : data[key]}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<div className="m-4"> {t("table.no_data")} </div>
				)}
			</div>
		</>
	);
};
