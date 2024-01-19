import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { BankSetting } from "~/server/database/entity/SALARY/bank_setting";
import { LoadingSpinner } from "~/components/loading";
import { TABLE_BANK_SETTING } from "~/pages/table_names";

export type RowItem = {
	bank_name: string;
	bank_code: string;
	org_name: string;
	org_code: string;
	start_date: Date;
	end_date: Date | null;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bank_columns = [
	columnHelper.accessor("bank_name", {
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
							Bank
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{`(${row.original.bank_code})${row.original.bank_name}`}</div>
		),
	}),
	columnHelper.accessor("org_name", {
		header: () => <div className="text-center">Company</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`(${row.original.org_code})${row.original.org_name}`}</div>
			);
		},
	}),
	columnHelper.accessor("start_date", {
		header: () => <div className="text-center">start</div>,
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium">{`${
					row.original.start_date.toISOString().split("T")[0]
				}`}</div>
			);
		},
	}),
	columnHelper.accessor("end_date", {
		header: () => <div className="text-center">end</div>,
		cell: ({ row }) => {
			return row.original.end_date ? (
				<div className="text-center font-medium">{`${
					row.original.end_date.toISOString().split("T")[0] ?? ""
				}`}</div>
			) : (
				<div className="text-center font-medium"></div>
			);
		},
	}),
];

export function bankSettingMapper(bankSettingData: BankSetting[]): RowItem[] {
	return bankSettingData.map((d) => {
		return {
			bank_name: d.bank_name,
			bank_code: d.bank_code,
			org_name: d.org_name,
			org_code: d.org_code,
			start_date: new Date(d.start_date),
			end_date: d.end_date ? new Date(d.end_date) : null,
		};
	});
}

export function BankTable({ index, globalFilter, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBankSetting.useQuery();
	const filterKey: RowItemKey = "bank_name";

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
					columns={bank_columns}
					data={bankSettingMapper(data)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bank_columns}
					data={bankSettingMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
