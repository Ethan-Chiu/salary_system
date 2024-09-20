import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { type BankSetting } from "~/server/database/entity/SALARY/bank_setting";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { SalaryIncomeTax } from "~/server/database/entity/SALARY/salary_income_tax";

export type RowItem = {
	salary_start: number;
	salary_end: number;
	dependent: number;
	tax_amount: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const salary_income_tax_columns = [
	columnHelper.accessor("salary_start", {
		header: ({ column }) => {
			const { t } = useTranslation(["common"]);
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
							{t("table.salary_start")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{`${row.original.salary_start}`}</div>
		),
	}),
	columnHelper.accessor("salary_end", {
		header: () => {
			const { t } = useTranslation(["common"]);
			return (
				<div className="text-center font-medium">
					{t("table.salary_end")}
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="text-center font-medium">{`${row.original.salary_end}`}</div>
		),
	}),
	columnHelper.accessor("dependent", {
		header: () => {
			const { t } = useTranslation(["common"]);
			return (
				<div className="text-center font-medium">
					{t("table.dependent")}
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.dependent}`}</div>
			);
		},
	}),
	columnHelper.accessor("tax_amount", {
		header: () => {
			const { t } = useTranslation(["common"]);
			return (
				<div className="text-center font-medium">
					{t("table.tax_amount")}
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${row.original.tax_amount}`}</div>
			);
		},
	}),
];

export function salaryIncomeTaxMapper(
	salaryIncomeTaxData: SalaryIncomeTax[]
): RowItem[] {
	return salaryIncomeTaxData.map((d) => {
		return {
			salary_start: d.salary_start,
			salary_end: d.salary_end,
			dependent: d.dependent,
			tax_amount: d.tax_amount,
		};
	});
}

interface SalaryIncomeTaxTableProps extends TableComponentProps {
	globalFilter?: string;
	viewOnly?: boolean;
}

export function SalaryIncomeTaxTable({ viewOnly }: SalaryIncomeTaxTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getAllSalaryIncomeTax.useQuery();
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
					columns={salary_income_tax_columns}
					data={salaryIncomeTaxMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={salary_income_tax_columns}
					data={salaryIncomeTaxMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
