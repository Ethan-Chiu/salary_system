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
import { bonusToolbarFunctionsContext } from "./bonus_functions_context";
import { FunctionMode } from "./data_table_functions";
import { LoadingSpinner } from "~/components/loading";
import { FieldConfig } from "~/components/ui/auto-form/types";
import periodContext from "~/components/context/period_context";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { Input } from "~/components/ui/input";
import GeneralTable from "~/components/function_sheet/general_table";

interface BonusFormProps<SchemaType extends z.AnyZodObject> {
	formSchema: SchemaType;
	fieldConfig?: FieldConfig<z.infer<SchemaType>>;
	defaultValue?: any;
	mode: FunctionMode;
	bonus_type: BonusTypeEnumType;
	closeSheet: () => void;
}

export function BonusForm<SchemaType extends z.AnyZodObject>({
	formSchema,
	fieldConfig,
	defaultValue,
	mode,
	bonus_type,
	closeSheet,
}: BonusFormProps<SchemaType>) {
	const { t } = useTranslation(["common"]);
	const functions = useContext(bonusToolbarFunctionsContext);

	const queryFunction = functions.queryFunction!;
	const updateFunction = functions.updateFunction!;
	const createFunction = functions.createFunction!;
	const deleteFunction = functions.deleteFunction!;
	const autoCalculateFunction = functions.autoCalculateFunction!;
	const { isLoading, isError, data, error } = queryFunction();
	// const { selectedBonusType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);

	const isList = Array.isArray(data);

	const [selectedData, setSelectedData] = useState((defaultValue) ?? (isList ? null : data));
	const [withoutDeafultValue, setWithoutDeafultValue] = useState(false);

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

	function submitForm(period_id: number, bonus_type: BonusTypeEnumType) {
		const parsedValues = formSchema.safeParse(formValues);
		if (parsedValues.success) {
			if (mode === "create") {
				createFunction.mutate({
					...parsedValues.data,
					period_id,
					bonus_type,
				});
			} else if (mode === "update") {
				if (!selectedData) {
					return;
				}
				updateFunction.mutate({
					...parsedValues.data,
					id: selectedData.id,
					bonus_type,
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

	if (mode === "auto_calculate") {
		return (
			<AutoCalculateForm
				onAutoCalculate={(totalBudgets: number) => {
					autoCalculateFunction.mutate({
						period_id: selectedPeriod!.period_id,
						bonus_type,
						total_budgets: totalBudgets,
					});
					closeSheet();
				}}
				onCancel={
					closeSheet
				}
			/>
		)
	}


	// Select one entry
	if (selectedData === null && !withoutDeafultValue) {
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
				setWithoutDeafultValue={setWithoutDeafultValue}
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
							<Button onClick={() => submitForm(selectedPeriod!.period_id, bonus_type)} type="submit">
								{t("button.save")}
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

const AutoCalculateForm = ({
	onAutoCalculate,
	onCancel,
}: {
	onAutoCalculate: (totalBudgets: number) => void;
	onCancel: () => void;
}) => {
	const [totalBudgets, setTotalBudgets] = useState<number>(0);
	const { t } = useTranslation(["common"]);

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex flex-row items-center m-4">
				<div className="w-1/5 text-center">{t("table.total_budgets")}</div>
				<Input
					className="w-full left-4 top-4"
					placeholder={t("others.filter_setting")}
					onChange={(e) => setTotalBudgets(Number(e.target.value))}
				/>
			</div>
			<div className="flex justify-between">
				<Button
					type="button"
					variant={"outline"}
					onClick={onCancel}
				>
					{t("button.cancel")}
				</Button>
				<Button onClick={() => onAutoCalculate(totalBudgets)}>
					{t("button.auto_calculate")}
				</Button>
			</div>
		</div>
	)
}

const CompViewAllDatas = ({
	dataNoID,
	mode,
	onUpdate,
	onDelete,
	setWithoutDeafultValue,
}: {
	dataNoID: any[];
	mode: FunctionMode;
	onUpdate: (index: number) => void;
	onDelete: (index: number) => void;
	setWithoutDeafultValue: (value: boolean) => void;
}) => {
	const { t } = useTranslation(["common"]);
	const [filterValue, setFilterValue] = useState<string>("");
	const [filteredDataList, setFilteredDataList] =
		useState(dataNoID);

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
					<Button className="absolute right-4 top-4" onClick={() => { setWithoutDeafultValue(true) }}>
						{t("button.no_default_value")}
					</Button>
				)}
			</div>
			<div className="m-4">
				{filteredDataList.length != 0 && filteredDataList[0] ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap text-center" />
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
												<TableCell
													key={key}
													className="whitespace-nowrap text-center font-medium"
												>
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
					<div className="m-4"> {t("table.no_data")} </div>
				)}
			</div>
		</>
	);
};
