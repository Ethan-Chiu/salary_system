import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr } from "../constant";
import { z } from "zod";
import { DropdownCopyAction } from "../../../components/data_table/dropdown_copy_action";
import { AttendanceSetting } from "~/server/database/entity/SALARY/attendance_setting";
import { LoadingSpinner } from "~/components/loading";

const rowSchema = z.object({
	name: z.string(),
	value: z.union([z.number(), z.string(), z.date()]),
});
type RowItem = z.infer<typeof rowSchema>;

type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const attendance_columns = [
	columnHelper.accessor("name", {
		header: ({ column }) => {
			return (
				<div className="flex justify-center">
					<div className="pl-4 text-center font-medium">
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							Parameter
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="flex justify-center">
				<div className="text-center font-medium">
					{row.getValue("name")}
				</div>
			</div>
		),
	}),
	columnHelper.accessor("value", {
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			const value = row.getValue("value");
			let formatted = "";
			if (isNumber(value))
				formatted = parseFloat(row.getValue("value")).toString();
			else if (isString(value)) formatted = row.getValue("value");
			else if (isDateType(value)) {
				if (value) {
					formatted =
						(value as Date).toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{formatted}</div>
				</div>
			);
		},
	}),
	// columnHelper.display({
	// 	id: "actions",
	// 	enableHiding: false,
	// 	cell: ({ row }) => {
	// 		return <CompDropdown row={row.original} />;
	// 	},
	// }),
];

export function attendanceMapper(
	attendanceData: AttendanceSetting[]
): RowItem[] {
	const data = attendanceData[0]!;
	return [
		{
			name: "事假扣薪",
			value: data.personal_leave_dock,
		},
		{
			name: "病假扣薪",
			value: data.sick_leave_dock,
		},
		{
			name: "不休假代金比率",
			value: data.rate_of_unpaid_leave,
		},
		{
			name: "不休假-補休1",
			value: data.unpaid_leave_compensatory_1,
		},
		{
			name: "不休假-補休2",
			value: data.unpaid_leave_compensatory_2,
		},
		{
			name: "不休假-補休3",
			value: data.unpaid_leave_compensatory_3,
		},
		{
			name: "不休假-補休4",
			value: data.unpaid_leave_compensatory_4,
		},
		{
			name: "不休假-補休5",
			value: data.unpaid_leave_compensatory_5,
		},
		{
			name: "本勞加班1",
			value: data.overtime_by_local_workers_1,
		},
		{
			name: "本勞加班2",
			value: data.overtime_by_local_workers_2,
		},
		{
			name: "本勞加班3",
			value: data.overtime_by_local_workers_3,
		},
		{
			name: "本勞假日",
			value: data.local_worker_holiday,
		},
		{
			name: "外勞加班1",
			value: data.overtime_by_foreign_workers_1,
		},
		{
			name: "外勞加班2",
			value: data.overtime_by_foreign_workers_2,
		},
		{
			name: "外勞加班3",
			value: data.overtime_by_foreign_workers_3,
		},
		{
			name: "外勞假日",
			value: data.foreign_worker_holiday,
		},
		{
			name: c_StartDateStr,
			value: new Date(data.start_date),
		},
		{
			name: c_EndDateStr,
			value: data.end_date ? new Date(data.end_date) : new Date(),
		},
		{
			name: c_CreateDateStr,
			value: data.create_date,
		},
	];
}

export function AttendanceTable({ index, globalFilter, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentAttendanceSetting.useQuery();
	const filterKey: RowItemKey = "name";

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
					columns={attendance_columns}
					data={attendanceMapper([data])}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={attendance_columns}
					data={attendanceMapper([data])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}

function CompDropdown({ row }: { row: RowItem }) {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownCopyAction value={row.value.toString()} />
					<DropdownMenuItem onClick={() => {}}>
						Update
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
