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
import { type SalaryIncomeTaxFEType } from "~/server/api/types/salary_income_tax";
import {
	FunctionsComponent,
	type FunctionsItem,
} from "~/components/data_table/functions_component";
import { type TFunction } from "i18next";
import { useContext } from "react";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { salaryIncomeTaxSchema } from "../schemas/configurations/salary_income_tax_schema";
import { Sheet } from "~/components/ui/sheet";
import dataTableContext, {
	type FunctionMode,
} from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";

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

export const salary_income_tax_columns = ({
	t,
	setOpen,
	setMode,
}: {
	t: TFunction<[string], undefined>;
	setOpen: (open: boolean) => void;
	setMode: (mode: FunctionMode) => void;
}) => [
	...[
		"salary_start",
		"salary_end",
		"dependent",
		"tax_amount",
		"start_date",
		"end_date",
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
							<div className="text-center font-medium">{`${row.original[
								key as RowItemKey
							]?.toString()}`}</div>
						);
				}
			},
		})
	),
	columnHelper.accessor("functions", {
		header: () => {
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
			functions: {
				create: d.creatable,
				update: d.updatable,
				delete: d.deletable,
			},
		};
	});
}

interface SalaryIncomeTaxTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function SalaryIncomeTaxTable({
	viewOnly,
	period_id,
}: SalaryIncomeTaxTableProps) {
	const { t } = useTranslation(["common"]);
	const { mode, setMode, open, setOpen } = useContext(dataTableContext);

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

	return !viewOnly ? (
		<Sheet open={open} onOpenChange={setOpen}>
			<DataTableWithFunctions
				columns={salary_income_tax_columns({
					t,
					setOpen,
					setMode,
				})}
				data={salaryIncomeTaxMapper(data!)}
				filterColumnKey={filterKey}
			/>
			<FunctionsSheetContent t={t} period_id={period_id}>
				<ParameterForm
					formSchema={salaryIncomeTaxSchema}
					mode={mode}
					closeSheet={() => {
						setOpen(false);
					}}
				/>
			</FunctionsSheetContent>
		</Sheet>
	) : (
		<DataTableWithoutFunctions
			columns={salary_income_tax_columns({
				t,
				setOpen,
				setMode,
			})}
			data={salaryIncomeTaxMapper(data!)}
			filterColumnKey={filterKey}
		/>
	);
}
