import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "../components/data_table";
import { BankSetting } from "~/server/database/entity/SALARY/bank_setting";

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

const columns = [
	columnHelper.accessor("bank_name", {
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Bank
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="w-[400px] pl-4 lowercase">{`(${row.original.bank_code})${row.original.bank_name}`}</div>
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

function bankSettingMapper(bankSettingData: BankSetting[]): RowItem[] {
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

export function BankTable({ index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBankSetting.useQuery();
	const filterKey: RowItemKey = "bank_name";

	if (isLoading) {
		return <span>Loading</span>; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<DataTable
			columns={columns}
			data={bankSettingMapper(data)}
			filterColumnKey={filterKey}
		/>
	);
}
