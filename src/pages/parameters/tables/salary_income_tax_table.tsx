import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { SalaryIncomeTaxFEType } from "~/server/api/types/salary_income_tax";
import { FunctionMode } from "../components/function_sheet/data_table_functions";
import { FunctionsComponent, FunctionsItem } from "~/components/data_table/functions_component";
import { TFunction } from "i18next";
import { useState } from "react";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { salaryIncomeTaxSchema } from "../schemas/configurations/salary_income_tax_schema";

export type RowItem = {
	salary_start: number;
	salary_end: number;
	dependent: number;
	tax_amount: number;
	start_date: string;
	end_date: string | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const salary_income_tax_columns = ({ t, period_id, open, setOpen, mode, setMode }: { t: TFunction<[string], undefined>, period_id: number, open: boolean, setOpen: (open: boolean) => void, mode: FunctionMode, setMode: (mode: FunctionMode) => void }) => [
	...["salary_start", "salary_end", "dependent", "tax_amount", "start_date", "end_date"].map(
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
					case "end_date":
						return row.original.end_date ? (
							<div className="text-center font-medium">{`${row.original.end_date}`}</div>
						) : (
							<div className="text-center font-medium"></div>
						);
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
					<ParameterToolbarFunctionsProvider
						selectedTableType={"TableBankSetting"}
						period_id={period_id}
					>
						<ScrollArea className="h-full w-full">
							<ParameterForm
								formSchema={salaryIncomeTaxSchema}
								mode={mode}
								closeSheet={() => setOpen(false)}
							/>
						</ScrollArea>
						<ScrollBar orientation="horizontal" />
					</ParameterToolbarFunctionsProvider>
				</FunctionsComponent>
			);
		},
	}),
];

export function salaryIncomeTaxMapper(
	salaryIncomeTaxData: SalaryIncomeTaxFEType[]
): RowItem[] {
	return salaryIncomeTaxData.map((d) => {
		return {
			salary_start: d.salary_start,
			salary_end: d.salary_end,
			dependent: d.dependent,
			tax_amount: d.tax_amount,
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
			functions: { create: d.creatable, update: d.updatable, delete: d.deletable }
		};
	});
}

interface SalaryIncomeTaxTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function SalaryIncomeTaxTable({ viewOnly, period_id }: SalaryIncomeTaxTableProps) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	const { isLoading, isError, data, error } =
		api.parameters.getCurrentSalaryIncomeTax.useQuery({ period_id });
	const filterKey: RowItemKey = "salary_start";

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
		return emptyError ? (
			<EmptyTable
				err_msg={err_msg}
				selectedTableType="TableSalaryIncomeTax"
			/>
		) : (
			<></>
		);
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={salary_income_tax_columns({ t, period_id, open, setOpen, mode, setMode })}
					data={salaryIncomeTaxMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={salary_income_tax_columns({ t, period_id, open, setOpen, mode, setMode })}
					data={salaryIncomeTaxMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
