import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { formatDate } from "~/lib/utils/format_date";
import { TrustMoneyFEType } from "~/server/api/types/trust_money_type";
import { FunctionsComponent, FunctionsItem } from "~/components/data_table/functions_component";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { useContext } from "react";
import { trustMoneySchema } from "../schemas/configurations/trust_money_schema";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import dataTableContext, { FunctionMode } from "../components/context/data_table_context";
import { FunctionsSheet } from "../components/function_sheet/functions_sheet";

export type RowItem = {
	position: number;
	position_type: string;
	org_trust_reserve_limit: number;
	org_special_trust_incent_limit: number;
	start_date: string;
	end_date: string | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const trust_money_columns = ({ t, setOpen, setMode }: { t: TFunction<[string], undefined>, setOpen: (open: boolean) => void, setMode: (mode: FunctionMode) => void }) => [
	...["position", "position_type", "org_trust_reserve_limit", "org_special_trust_incent_limit", "start_date", "end_date"].map(
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
				<FunctionsComponent
					t={t}
					setOpen={setOpen}
					setMode={setMode}
					functionsItem={row.original.functions}
				/>
			);
		},
	}),
];

export function trustMoneyMapper(
	TrustMoneyData: TrustMoneyFEType[]
): RowItem[] {
	return TrustMoneyData.map((d) => ({
		position: d.position,
		position_type: d.position_type,
		org_trust_reserve_limit: d.org_trust_reserve_limit,
		org_special_trust_incent_limit: d.org_special_trust_incent_limit,
		start_date: formatDate("day", d.start_date) ?? "",
		end_date: formatDate("day", d.end_date) ?? "",
		functions: { create: d.creatable, update: d.updatable, delete: d.deletable },
	}));
}

interface TrustMoneyTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function TrustMoneyTable({ period_id, viewOnly }: TrustMoneyTableProps) {
	const { t } = useTranslation(["common"]);
	const { mode, setMode, open, setOpen } = useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.parameters.getCurrentTrustMoney.useQuery({ period_id });
	const filterKey: RowItemKey = "position";

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		// return <span>Error: {error.message}</span>; // TODO: Error element with toast
		const err_msg = error.message;
		const emptyError = true;
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableTrustMoney" /> : <></>;
	}

	return !viewOnly ? (
		<FunctionsSheet t={t} period_id={period_id}>
			<DataTableWithFunctions
				columns={trust_money_columns({ t, setOpen, setMode })}
				data={trustMoneyMapper(data!)}
				filterColumnKey={filterKey}
			/>
		</FunctionsSheet>
	) : (
		<DataTableWithoutFunctions
			columns={trust_money_columns({ t, setOpen, setMode })}
			data={trustMoneyMapper(data!)}
			filterColumnKey={filterKey}
		/>
	)
}
