import { api } from "~/utils/api";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EmployeeBonusFEType } from "~/server/api/types/employee_bonus_type";
import { TFunction } from "i18next";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { employeeBonusSchema } from "../schemas/configurations/employee_bonus_schema";

import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";

export type RowItem = EmployeeBonusFEType & {
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;
const columnHelper = createColumnHelper<RowItem>();

const employee_bonus_budget_columns = ({
	t,
	setOpen,
	setMode,
	setData,
}: {
	t: TFunction<[string], undefined>;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
	setData: (data: RowItem) => void;
}) => [
	...[
		"department",
		"emp_no",
		"emp_name",
		"base_salary",
		"food_allowance",
		"supervisor_allowance",
		"occupational_allowance",
		"subsidy_allowance",
		"long_service_allowance",
		"special_multiplier",
		"multiplier",
		"fixed_amount",
		"bud_effective_salary",
		"bud_amount",
	].map((key: string) =>
		columnHelper.accessor(key as RowItemKey, {
			header: ({ column }) => {
				return (
					<div className="flex justify-center">
						<div className="text-center font-medium">
							<Button
								variant="ghost"
								onClick={() =>
									column.toggleSorting(
										column.getIsSorted() === "asc"
									)
								}
							>
								{t(`table.${key}`)}
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</div>
				);
			},
			cell: ({ row }) => {
				switch (key) {
					default:
						return (
							<div className="text-center font-medium">{`${
								row.original[key as RowItemKey]
							}`}</div>
						);
				}
			},
		})
	),
	columnHelper.accessor("functions", {
		header: ({ column }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">
						{t(`others.functions`)}
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<FunctionsComponent
					t={t}
					setOpen={setOpen}
					setMode={setMode}
					data={row.original}
					setData={setData}
				/>
			);
		},
	}),
];

export function employeeBonusMapper(
	employeeBonusData: EmployeeBonusFEType[]
): RowItem[] {
	return employeeBonusData.map((d) => {
		return {
			...d,
            id: d.id,
			functions: d.functions,
			// functions: { create: d.creatable, update: d.updatable, delete: d.deletable }
		};
	});
}

interface EmployeeBonusTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function EmployeeBonusTable({
	period_id,
	bonus_type,
	viewOnly,
}: EmployeeBonusTableProps) {
	const { t } = useTranslation(["common"]);
	const { selectedBonusType, open, setOpen, mode, setMode, setData } =
		useContext(dataTableContext);

	const ctx = api.useUtils();
	const initFunction = api.bonus.initCandidateEmployeeBonus.useMutation({
		onSuccess: () => {
			void ctx.bonus.getEmployeeBonus.invalidate();
		},
	});
	const { isLoading, isError, data, error } =
		api.bonus.getEmployeeBonus.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "emp_no";
	const { setSelectedTableType } = useContext(dataTableContext);

	useEffect(() => {
		setSelectedTableType("TableEmployeeBonus");
		initFunction.mutate({ period_id, bonus_type });
	}, []);

	if (initFunction.isPending || isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
			{/* <Button onClick={() => console.log(data)}>debug</Button> */}
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider
					selectedTableType={"TableEmployeeBonus"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={open && mode !== "delete"}
						onOpenChange={setOpen}
					>
						{/* <Button onClick={() => console.log(selectedBonusType)}>TEST</Button> */}
						<DataTableWithFunctions
							columns={employee_bonus_budget_columns({
								t,
								setOpen,
								setMode,
								setData,
							})}
							data={employeeBonusMapper(data!)}
							bonusType={bonus_type}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<BonusForm
								formSchema={employeeBonusSchema}
								formConfig={[
									{ key: "id", config: { hidden: true } },
								]}
								mode={mode}
								closeSheet={() => {
									setOpen(false);
								}}
							/>
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog
						open={open && mode === "delete"}
						onOpenChange={setOpen}
						schema={employeeBonusSchema}
					/>
				</BonusToolbarFunctionsProvider>
			) : (
				<DataTableWithoutFunctions
					columns={employee_bonus_budget_columns({
						t,
						setOpen,
						setMode,
						setData,
					})}
					data={employeeBonusMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
