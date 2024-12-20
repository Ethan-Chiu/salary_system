import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr, c_UpdateDateStr } from "../constant";
import { z } from "zod";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { AttendanceSettingFEType } from "~/server/api/types/attendance_setting_type";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "~/components/ui/sheet";
import { useContext, useEffect, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { attendanceSchema } from "../schemas/configurations/attendance_schema";
import dataTableContext, { FunctionMode } from "../components/context/data_table_context";
import { modeDescription } from "~/lib/utils/helper_function";
import { getTableNameKey } from "../components/context/data_table_enum";
import { FunctionsSheet } from "../components/function_sheet/functions_sheet";

const rowSchema = z.object({
	parameters: z.string(),
	value: z.union([z.number(), z.string(), z.date()]),
});
type RowItem = z.infer<typeof rowSchema>;

type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const attendance_columns = ({ t }: { t: TFunction<[string], undefined> }) => [
	...["parameters", "value"].map(
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
					default:
						return <div className="text-center font-medium">{`${row.original[key as RowItemKey]}`}</div>
				}
			}
		})),
];

export function attendanceMapper(
	attendanceData: AttendanceSettingFEType[]
): RowItem[] {
	const data = attendanceData[0]!;
	return [
		{
			parameters: "本勞加班1",
			value: data.overtime_by_local_workers_1,
		},
		{
			parameters: "本勞加班2",
			value: data.overtime_by_local_workers_2,
		},
		{
			parameters: "本勞加班3",
			value: data.overtime_by_local_workers_3,
		},
		{
			parameters: "本勞加班4",
			value: data.overtime_by_local_workers_4,
		},
		{
			parameters: "本勞加班5",
			value: data.overtime_by_local_workers_5,
		},
		{
			parameters: "外勞加班1",
			value: data.overtime_by_foreign_workers_1,
		},
		{
			parameters: "外勞加班2",
			value: data.overtime_by_foreign_workers_2,
		},
		{
			parameters: "外勞加班3",
			value: data.overtime_by_foreign_workers_3,
		},
		{
			parameters: "外勞加班4",
			value: data.overtime_by_foreign_workers_4,
		},
		{
			parameters: "外勞加班5",
			value: data.overtime_by_foreign_workers_5,
		},
		{
			parameters: c_StartDateStr,
			value: formatDate("day", data.start_date) ?? "",
		},
		{
			parameters: c_EndDateStr,
			value: formatDate("day", data.end_date) ?? "",
		},
		// {
		// 	parameters: c_CreateDateStr,
		// 	value: formatDate("hour", data.create_date) ?? "",
		// },
		// {
		// 	parameters: c_UpdateDateStr,
		// 	value: formatDate("hour", data.update_date) ?? "",
		// },
	];
}

interface AttendanceTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function AttendanceTable({ period_id, viewOnly }: AttendanceTableProps) {
	const { t } = useTranslation(["common"]);
	const { selectedTab, setFunctionsItem } = useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const filterKey: RowItemKey = "parameters";

	useEffect(() => {
		setFunctionsItem({
			create: data?.creatable ?? false,
			update: data?.updatable ?? false,
			delete: data?.deletable ?? false,
		});
	}, [data, selectedTab]);

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
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableAttendance" /> : <></>;
	}

	return (
		<>
			{!viewOnly ? (
				<FunctionsSheet t={t} period_id={period_id}>
					<DataTableWithFunctions
						columns={attendance_columns({ t })}
						data={attendanceMapper([data!])}
						filterColumnKey={filterKey}
					/>
				</FunctionsSheet>
			) : (
				<DataTableWithoutFunctions
					columns={attendance_columns({ t })}
					data={attendanceMapper([data!])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
