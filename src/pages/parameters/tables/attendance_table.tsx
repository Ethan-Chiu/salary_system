import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
	isString,
	isNumber,
	isDate,
} from "~/pages/develop_parameters/utils/checkType";
import { DataTable } from "../components/data_table";
import { AttendanceSetting } from "~/server/database/entity/attendance_setting";
import {
	c_CreateDateStr,
	c_EndDateStr,
	c_StartDateStr,
} from "../constant";

export type SettingItem = {
	name: string;
	value: number | string | Date;
};

const columnHelper = createColumnHelper<SettingItem>();

const columns = [
	columnHelper.accessor("name", {
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Parameter
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="pl-4 w-[400px] lowercase">{row.getValue("name")}</div>
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
			else if (isDate(value)) {
				if (value) {
					formatted =
						(value as Date).toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return <div className="flex justify-center"><div className="w-80 text-center font-medium">{formatted}</div></div>;
		},
	}),
];

function attendanceMapper(attendanceData: AttendanceSetting): SettingItem[] {
	return [
		{
			name: "事假扣薪",
			value: attendanceData.personal_leave_dock,
		},
		{
			name: "病假扣薪",
			value: attendanceData.sick_leave_dock,
		},
		{
			name: "不休假代金比率",
			value: attendanceData.rate_of_unpaid_leave,
		},
		{
			name: "不休假-補休1",
			value: attendanceData.unpaid_leave_compensatory_1,
		},
		{
			name: "不休假-補休2",
			value: attendanceData.unpaid_leave_compensatory_2,
		},
		{
			name: "不休假-補休3",
			value: attendanceData.unpaid_leave_compensatory_3,
		},
		{
			name: "不休假-補休4",
			value: attendanceData.unpaid_leave_compensatory_4,
		},
		{
			name: "不休假-補休5",
			value: attendanceData.unpaid_leave_compensatory_5,
		},
		{
			name: "本勞加班1",
			value: attendanceData.overtime_by_local_workers_1,
		},
		{
			name: "本勞加班2",
			value: attendanceData.overtime_by_local_workers_2,
		},
		{
			name: "本勞加班3",
			value: attendanceData.overtime_by_local_workers_3,
		},
		{
			name: "本勞假日",
			value: attendanceData.local_worker_holiday,
		},
		{
			name: "外勞加班1",
			value: attendanceData.overtime_by_foreign_workers_1,
		},
		{
			name: "外勞加班2",
			value: attendanceData.overtime_by_foreign_workers_2,
		},
		{
			name: "外勞加班3",
			value: attendanceData.overtime_by_foreign_workers_3,
		},
		{
			name: "外勞假日",
			value: attendanceData.foreign_worker_holiday,
		},
		{
			name: c_StartDateStr,
			value: new Date(attendanceData.start_date),
		},
		{
			name: c_EndDateStr,
			value: attendanceData.end_date
				? new Date(attendanceData.end_date)
				: new Date(),
		},
		{
			name: c_CreateDateStr,
			value: attendanceData.create_date,
		},
	];
}

export function AttendanceTable({ index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentAttendanceSetting.useQuery();
	const filterKey = "name";

	if (isLoading) {
		return <span>Loading</span>; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{"請假加班"}</AccordionTrigger>
				<AccordionContent>
					<DataTable
						columns={columns}
						data={attendanceMapper(data)}
						filterColumnKey={filterKey}
					/>
				</AccordionContent>
			</AccordionItem>
		</>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
