import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusPosition } from "~/server/database/entity/SALARY/bonus_position";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useState, useContext } from "react";
import { bonusPositionSchema } from "../schemas/configurations/bonus_position_schema";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { TFunction } from "i18next";

import { Sheet } from "~/components/ui/sheet";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import { formatDate } from "~/lib/utils/format_date";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";
import { BonusPositionFEType } from "~/server/api/types/bonus_position_type";

export type RowItem = {
	position: number;
	position_type: string;
	position_multiplier: number;
	position_type_multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_position_columns = ({
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
		"position",
		"position_multiplier",
		"position_type_multiplier",
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
					case "position":
						return (
							<div className="text-center font-medium">{`${row.original.position}${row.original.position_type}`}</div>
						);
					default:
						return (
							<div className="text-center font-medium">{`${row.original[key as RowItemKey]?.toString()}`}</div>
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

export function bonusPositionMapper(
	bonusPositionData: BonusPositionFEType[]
): RowItem[] {
	return bonusPositionData.map((d) => {
		return {
			// positionAndPositionType: d.position + d.position_type,
			id: d.id,
			position: d.position,
			position_type: d.position_type,
			position_multiplier: d.position_multiplier,
			position_type_multiplier: d.position_type_multiplier,
			functions: d.functions,
			// functions: { "create": d.creatable, "update": d.updatable, "delete": d.deletable },
		};
	});
}

interface BonusPositionTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusPositionTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusPositionTableProps) {
	const { t } = useTranslation(["common"]);
	const { selectedBonusType, open, setOpen, mode, setMode, setData } =
		useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.bonus.getBonusPosition.useQuery({ period_id, bonus_type });
	const filterKey: RowItemKey = "position";

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
					selectedTableType={"TableBonusPosition"}
					period_id={period_id}
					bonus_type={bonus_type}
				>
					<Sheet
						open={open && mode !== "delete"}
						onOpenChange={setOpen}
					>
						{/* <Button onClick={() => console.log(selectedBonusType)}>TEST</Button> */}
						<DataTableWithFunctions
							columns={bonus_position_columns({
								t,
								setOpen,
								setMode,
								setData,
							})}
							data={bonusPositionMapper(data!)}
							bonusType={bonus_type}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<BonusForm
								formSchema={bonusPositionSchema}
								formConfig={[{ key: "id", config: { hidden: true } }]}
								mode={mode}
								closeSheet={() => {
									setOpen(false);
								}}
							/>
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={bonusPositionSchema}/>
				</BonusToolbarFunctionsProvider>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_position_columns({
						t,					
						setOpen,
						setMode,
						setData,
					})}
					data={bonusPositionMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
