import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusDepartment } from "~/server/database/entity/SALARY/bonus_department";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useContext, useState } from "react";
import { TFunction } from "i18next";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { bonusDepartmentSchema } from "../schemas/configurations/bonus_department_schema";

import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";

export type RowItem = {
	department: string;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_department_columns = ({
	t,
	setOpen,
	setMode,
	setData,
}: {
	t: TFunction<[string], undefined>;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
	setData: (data: RowItem) => void;
})  => [
	...["department", "multiplier"].map((key: string) =>
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

export function bonusDepartmentMapper(
	bonusDepartmentData: BonusDepartment[]
): RowItem[] {
	return bonusDepartmentData.map((d) => {
		return {
			id: d.id,
			department: d.department,
			multiplier: d.multiplier,
			functions: { create: true, update: true, delete: true },
			// functions: { "create": d.creatable, "update": d.updatable, "delete": d.deletable },
		};
	});
}

interface BonusDepartmentTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusDepartmentTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusDepartmentTableProps) {
	const { t } = useTranslation(["common"]);
	const { selectedBonusType, open, setOpen, mode, setMode, setData } = useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.bonus.getBonusDepartment.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "department";

	if (isLoading) {
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
			{!viewOnly ? (
				<BonusToolbarFunctionsProvider
				selectedTableType={"TableBonusDepartment"}
				period_id={period_id}
				bonus_type={bonus_type}
			>
				<Sheet
					open={open && mode !== "delete"}
					onOpenChange={setOpen}
				>
					{/* <Button onClick={() => console.log(selectedBonusType)}>TEST</Button> */}
					<DataTableWithFunctions
						columns={bonus_department_columns({
							t,
							setOpen,
							setMode,
							setData,
						})}
						data={bonusDepartmentMapper(data!)}
						bonusType={bonus_type}
						filterColumnKey={filterKey}
					/>
					<FunctionsSheetContent t={t} period_id={period_id}>
						<BonusForm
							formSchema={bonusDepartmentSchema}
							formConfig={[{ key: "id", config: { hidden: true } }]}
							mode={mode}
							closeSheet={() => {
								setOpen(false);
							}}
						/>
					</FunctionsSheetContent>
				</Sheet>
				<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={bonusDepartmentSchema}/>
			</BonusToolbarFunctionsProvider>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_department_columns({
						t,
						setOpen,
						setMode,
						setData
					})}
					data={bonusDepartmentMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
