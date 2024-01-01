import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "../components/data_table";
import {
	c_CreateDateStr,
	c_EndDateStr,
	c_StartDateStr,
} from "../constant";
import { BonusDepartment } from "~/server/database/entity/SALARY/bonus_department";
import { LoadingSpinner } from "~/components/loading";

export type RowItem = {
	department: string;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("department", {
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Department
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="pl-4 w-[400px] lowercase">{row.getValue("department")}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => <div className="text-center">Multiplier</div>,
		cell: ({ row }) => {
			return <div className="flex justify-center"><div className="w-80 text-center font-medium">{`${row.original.multiplier}`}</div></div>;
		},
	}),
];

function bonusDepartmentMapper(bonusDepartmentData: BonusDepartment[]): RowItem[] {
	return bonusDepartmentData.map((d) => {
		return {
			department: d.department,
			multiplier: d.multiplier,
		}})
}

export function BonusDepartmentTable({ index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusDepartment.useQuery();
	const filterKey: RowItemKey = "department";

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<DataTable
			columns={columns}
			data={bonusDepartmentMapper(data)}
			filterColumnKey={filterKey}
		/>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
