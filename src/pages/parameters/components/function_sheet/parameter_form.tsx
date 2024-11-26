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
} from "~/components/ui/dialog";
import { Copy, PenSquare, Trash2 } from "lucide-react";
import { useContext } from "react";
import { parameterToolbarFunctionsContext } from "./parameter_functions_context";
import { FunctionMode } from "./data_table_functions";
import GeneralTable from "./general_table";
import { Input } from "~/components/ui/input";
import { LoadingSpinner } from "~/components/loading";
import { FieldConfig } from "~/components/ui/auto-form/types";

interface ParameterFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	defaultValue?: any;
	mode: FunctionMode;
	closeSheet: () => void;
}

export function ParameterForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	defaultValue,
	mode,
	closeSheet,
}: ParameterFormProps<SchemaType>) {
	const { t } = useTranslation(["common"]);
	const functions = useContext(parameterToolbarFunctionsContext);

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const { isLoading, isError, data, error } = queryFunction();

	const isList = Array.isArray(data);

	const [selectedData, setSelectedData] = useState((defaultValue) ?? null);

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
		// closeSheet();
		setSelectedData(null);
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

	if (!data) {
		return <p>{t("others.no_data")}</p>;
	}


	// Select one entry
	if (selectedData === null) {
		const dataList = isList ? data : [data]
		const noIDData: any[] = dataList.map((item: any) => {
			const { ["id"]: id, ...rest } = item;
			return rest;
		});

		return (
			<CompViewAllDatas
				dataNoID={noIDData}
				mode={mode}
				onUpdate={(index: number) => {
					const dataList = isList ? data : [data]
					console.log(dataList, index, dataList[index]);
					setSelectedData(dataList[index]);
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
				className="mb-10 mr-5 ml-5 mt-5"
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
			{/* Submit change dialog */}
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
	onUpdate,
	onDelete,
}: {
	dataNoID: any[];
	mode: FunctionMode;
	onUpdate: Function;
	onDelete: Function;
}) => {
	const [filterValue, setFilterValue] = useState<string>("");
	const [filteredDataList, setFilteredDataList] = useState(dataNoID);
	const { t } = useTranslation(["common"]);

	useEffect(() => {
		const filteredData = dataNoID?.filter((data) => {
			return Object.values(data).some((value: any) =>
				value ? value.toString().includes(filterValue) : false
			);
		});
		setFilteredDataList(filteredData);
	}, [dataNoID, filterValue]);

	return (
		<>
			<div className="flex h-[4rem] items-center justify-between">
				<Input
					className="w-1/10 absolute left-4 top-4"
					placeholder={t("others.filter_setting")}
					onChange={(e) => setFilterValue(e.target.value)}
				></Input>
				{mode == "create" && (
					<Button className="absolute right-4 top-4" onClick={() => {}}>
						{t("button.no_default_value")}
					</Button>
				)}
			</div>
			<div>
				{filteredDataList.length != 0 && filteredDataList[0] ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap text-center"></TableHead>
								{Object.keys(filteredDataList[0]).map(
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
							{filteredDataList.map((data: any, index: number) => {
								return (
									<TableRow key={data.id}>
										<TableCell className="items-center">
											{mode === "create" && (
												<Copy
													size={18}
													className="cursor-pointer"
													onClick={() => {
														onUpdate(index);
													}}
												/>
											)}
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
												<TableCell key={key} className="text-center font-medium whitespace-nowrap">
													{/* {isDate(data[key]) ? data[key].toDateString() : data[key]} */}
													{data[key]}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				) : (
					<div className="m-4 text-center"> {t("table.no_data")} </div>
				)}
			</div>
		</>
	);
};
