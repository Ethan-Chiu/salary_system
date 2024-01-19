import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr } from "../constant";
import { BonusDepartment } from "~/server/database/entity/SALARY/bonus_department";
import { LoadingSpinner } from "~/components/loading";
import { TABLE_BONUS_DEPARTMENT } from "~/pages/table_names";

export type RowItem = {
	department: string;
	multiplier: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const bonus_department_columns = [
	columnHelper.accessor("department", {
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
							Department
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("department")}</div>
		),
	}),
	columnHelper.accessor("multiplier", {
		header: () => <div className="text-center">Multiplier</div>,
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{`${row.original.multiplier}`}</div>
				</div>
			);
		},
	}),
];

export function bonusDepartmentMapper(
	bonusDepartmentData: BonusDepartment[]
): RowItem[] {
	return bonusDepartmentData.map((d) => {
		return {
			department: d.department,
			multiplier: d.multiplier,
		};
	});
}

export function BonusDepartmentTable({ index, globalFilter, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentBonusDepartment.useQuery();
	const filterKey: RowItemKey = "department";

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
					columns={bonus_department_columns}
					data={bonusDepartmentMapper(data)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={bonus_department_columns}
					data={bonusDepartmentMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
