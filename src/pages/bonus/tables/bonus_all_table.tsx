import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BonusAll } from "~/server/database/entity/SALARY/bonus_all";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { useTranslation } from "react-i18next";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { TFunction } from "i18next";
// import { FunctionMode } from "../components/function_sheet/data_table_functions_single";
import { FunctionsComponent } from "~/components/data_table/functions_component";
import dataTableContext, {
	FunctionsItem,
	type FunctionMode,
} from "../components/context/data_table_context";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { bonusAllSchema } from "../schemas/configurations/bonus_all_schema";
import { useContext, useState } from "react";
import { Sheet } from "~/components/ui/sheet";

import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

export type RowItem = {
	parameters: string;
	value: number;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_all_columns = (
	{
		t,
		period_id,
		bonus_type,
		setOpen,
		setMode,
		setData,
	}: {
		t: TFunction<[string], undefined>;
		period_id: number;
		bonus_type: BonusTypeEnumType;
		setOpen: (open: boolean) => void;
		setMode: (mode: FunctionMode) => void;
	    setData: (data: RowItem) => void;
	}
) => [
	...["parameters", "value"].map((key: string) =>
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
	// columnHelper.accessor("functions", {
	// 	header: () => {
	// 		return (
	// 			<div className="flex justify-center">
	// 				<div className="text-center font-medium">
	// 					{t(`others.functions`)}
	// 				</div>
	// 			</div>
	// 		);
	// 	},
	// 	cell: ({ row }) => {
	// 		return (
	// 			<FunctionsComponent
	// 				t={t}
	// 				setOpen={setOpen}
	// 				setMode={setMode}
	// 				data={row.original}
	// 				setData={setData}
	// 			/>
	// 		);
	// 	},
	// }),
];

export function bonusAllMapper(bonusAllData: BonusAll[]): RowItem[] {
	return bonusAllData.map((d) => {
		return {
			parameters: "倍率",
			value: d.multiplier,
            functions: {
				create: true,
				update: false,
				delete: false,
			},
		};
	});
}

interface BonusAllTableProps extends TableComponentProps {
	period_id: number;
	bonus_type: BonusTypeEnumType;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function BonusAllTable({
	period_id,
	bonus_type,
	viewOnly,
}: BonusAllTableProps) {
	const { t } = useTranslation(["common"]);
	// const [open, setOpen] = useState<boolean>(false);
	// const [mode, setMode] = useState<FunctionMode>("none");
	const { open, setOpen, mode, setMode, setData } = useContext(dataTableContext);


	const { isLoading, isError, data, error } = api.bonus.getBonusAll.useQuery({
		period_id,
		bonus_type,
	});
	const filterKey: RowItemKey = "parameters";

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
				<BonusToolbarFunctionsProvider selectedTableType={"TableBonusAll"} period_id={period_id} bonus_type={bonus_type}>
					<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
						<DataTableWithFunctions
							columns={bonus_all_columns({
								t,
								period_id,
								bonus_type,
								setOpen,
								setMode,
								setData,
							})}
							data={bonusAllMapper(data!)}
							bonusType={bonus_type}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<BonusForm
								formSchema={bonusAllSchema}
								formConfig={[{ key: "id", config: { hidden: true } }]}
								mode={mode}
								closeSheet={() => setOpen(false)}
							/>
						</FunctionsSheetContent>
					</Sheet>
				</BonusToolbarFunctionsProvider>
			) : (
				<></>
				// <DataTableWithoutFunctions
				// 	columns={bonus_all_columns({
				// 		t,
				// 		period_id,
				// 		bonus_type,
				// 		setOpen,
				// 		setMode,
				// 		setData,
				// 	})}
				// 	data={bonusAllMapper(data!)}
				// 	bonusType={bonus_type}
				// 	filterColumnKey={filterKey}
				// />
			)}
		</>
	);
}
