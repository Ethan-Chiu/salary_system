import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusSeniority } from "~/server/database/entity/SALARY/bonus_seniority";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useContext, useState } from "react";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { bonusSenioritySchema } from "../schemas/configurations/bonus_seniority_schema";
import { TFunction } from "i18next";

import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import { BonusSeniorityFEType } from "~/server/api/types/bonus_seniority_type";

export type RowItem = {
	seniority: number;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_seniority_columns = ({
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
	...["seniority", "multiplier"].map((key: string) =>
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

export function bonusSeniorityMapper(
	bonusSeniorityData: BonusSeniorityFEType[]
): RowItem[] {
	return bonusSeniorityData.map((d) => {
		return {
			id: d.id,
			seniority: d.seniority,
			multiplier: d.multiplier,
			functions: d.functions,
			// functions: { "create": d.creatable, "update": d.updatable, "delete": d.deletable },
		};
	});
}

interface BonusSeniorityTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusSeniorityTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusSeniorityTableProps) {
	const { t } = useTranslation(["common"]);
	const { selectedBonusType, open, setOpen, mode, setMode, setData } = useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.bonus.getBonusSeniority.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "seniority";

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
					selectedTableType={"TableBonusSeniority"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={open && mode !== "delete"}
						onOpenChange={setOpen}
					>
						{/* <Button onClick={() => console.log(selectedBonusType)}>TEST</Button> */}
						<DataTableWithFunctions
							columns={bonus_seniority_columns({
								t,
								setOpen,
								setMode,
								setData,
							})}
							data={bonusSeniorityMapper(data!)}
							bonusType={bonus_type}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<BonusForm
								formSchema={bonusSenioritySchema}
								formConfig={[{ key: "id", config: { hidden: true } }]}
								mode={mode}
								closeSheet={() => {
									setOpen(false);
								}}
							/>
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={bonusSenioritySchema}/>
				</BonusToolbarFunctionsProvider>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_seniority_columns({
						t,
						setOpen,
						setMode,
						setData,
					})}
					data={bonusSeniorityMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
