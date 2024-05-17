import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr, c_UpdateDateStr } from "../constant";
import { z } from "zod";
import { type AttendanceSetting } from "~/server/database/entity/SALARY/attendance_setting";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { useState } from "react";
import { EmptyCreate } from "./empty_create";
import { getSchema } from "../schemas/get_schemas";

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
					formatted = value.toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{formatted}</div>
				</div>
			);
		},
	}),
];

export function attendanceMapper(
	attendanceData: AttendanceSetting[]
): RowItem[] {
	const data = attendanceData[0]!;
	return [
		{
			name: "事假扣薪",
			value: data.personal_leave_deduction,
		},
		{
			name: "病假扣薪",
			value: data.sick_leave_deduction,
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
			value: formatDate("day", data.start_date),
		},
		{
			name: c_EndDateStr,
			value: data.end_date ? formatDate("day", data.end_date) : "",
		},
		{
			name: c_CreateDateStr,
			value: formatDate("hour", data.create_date),
		},
		{
			name: c_UpdateDateStr,
			value: formatDate("hour", data.update_date),
		},
	];
}

interface AttendanceTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function AttendanceTable({ period_id, viewOnly }: AttendanceTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const filterKey: RowItemKey = "name";

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
		return emptyError ? <EmptyTable err_msg={err_msg} /> : <></>;
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



export function EmptyTable({ err_msg }: { err_msg: string }) {
	const selectedTableType = "TableAttendance";
	const [alertOpen, setAlertOpen] = useState(true);
	return (
		<>
			<div className="flex grow items-center justify-center">
				<div className="text-center">
					<p>{err_msg}</p>
					<Button
						variant={"ghost"}
						onClick={() => setAlertOpen(true)}
					>
						Create
					</Button>
				</div>
				<EmptyCreate
					formSchema={getSchema(selectedTableType)}
					onClose={() => undefined}
					selectedTableType={selectedTableType}
					err_msg={err_msg}
					alertOpen={alertOpen}
					setAlertOpen={setAlertOpen}
				/>
			</div>
		</>
	);
}
