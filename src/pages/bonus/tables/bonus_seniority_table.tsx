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
import { useState } from "react";
import { FunctionMode } from "../components/function_sheet/data_table_functions_single";
import { FunctionsComponent, FunctionsItem } from "~/components/data_table/functions_component";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { bonusSenioritySchema } from "../schemas/configurations/bonus_seniority_schema";
import { TFunction } from "i18next";

export type RowItem = {
	seniority: number;
	multiplier: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_seniority_columns = ({ t, period_id, bonus_type, open, setOpen, mode, setMode }: { t: TFunction<[string], undefined>, period_id: number, bonus_type: BonusTypeEnumType, open: boolean, setOpen: (open: boolean) => void, mode: FunctionMode, setMode: (mode: FunctionMode) => void }) => [
	...["seniority", "multiplier"].map(
		(key: string) => columnHelper.accessor(key as RowItemKey, {
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
						return <div className="text-center font-medium">{`${row.original[key as RowItemKey]}`}</div>
				}
			}
		})),
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
				<FunctionsComponent t={t} open={open} setOpen={setOpen} mode={mode} setMode={setMode} functionsItem={row.original.functions} >
					<BonusToolbarFunctionsProvider
						selectedTableType={"TableBonusSeniority"}
						bonus_type={bonus_type}
						period_id={period_id}
					>
						<ScrollArea className="h-full w-full">
							<BonusForm
								formSchema={bonusSenioritySchema}
								bonus_type={bonus_type}
								mode={mode}
								closeSheet={() => setOpen(false)}
							/>
						</ScrollArea>
						<ScrollBar orientation="horizontal" />
					</BonusToolbarFunctionsProvider>
				</FunctionsComponent>
			);
		},
	}),
];

export function bonusSeniorityMapper(
	bonusSeniorityData: BonusSeniority[]
): RowItem[] {
	return bonusSeniorityData.map((d) => {
		return {
			seniority: d.seniority,
			multiplier: d.multiplier,
			functions: { "create": true, "update": false, "delete": false },
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

export function BonusSeniorityTable({ period_id, bonus_type, viewOnly }: BonusSeniorityTableProps) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

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
				<DataTableWithFunctions
					columns={bonus_seniority_columns({ t, period_id, bonus_type, open, setOpen, mode, setMode })}
					data={bonusSeniorityMapper(data!)}
					bonusType={bonus_type}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_seniority_columns({ t, period_id, bonus_type, open, setOpen, mode, setMode })}
					data={bonusSeniorityMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
