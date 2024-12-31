import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_EndDateStr, c_StartDateStr } from "../constant";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { type AttendanceSettingFEType } from "~/server/api/types/attendance_setting_type";
import { Sheet } from "~/components/ui/sheet";
import { useContext, useEffect } from "react";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { attendanceSchema } from "../schemas/configurations/attendance_schema";
import dataTableContext from "../components/context/data_table_context";
import { FunctionsSheetContent } from "../components/function_sheet/functions_sheet_content";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ConfirmDialog } from "../components/function_sheet/confirm_dialog";

export type RowItem = {
	parameters: string;
	value: number | string | Date | null;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const attendance_columns = ({
	t,
}: {
	t: TFunction<[string], undefined>;
}) => {
	const f: RowItemKey[] = ["parameters", "value"];
	return [
		...f.map((key) =>
			columnHelper.accessor(key, {
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
					if (key === "value") {
						if (
							row.original.parameters === c_StartDateStr ||
							row.original.parameters === c_EndDateStr
						) {
							return (
								<div className="text-center font-medium">
									{formatDate(
										"day",
										row.original.value as Date | null
									) ?? ""}
								</div>
							);
						}
					}
					return (
						<div className="text-center font-medium">{`${row.original[
							key
						]?.toString()}`}</div>
					);
				},
			})
		),
	];
};

export function attendanceMapper(
	attendanceData: AttendanceSettingFEType[]
): RowItem[] {
	// TODO: check assertion
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
			value: data.start_date,
		},
		{
			parameters: c_EndDateStr,
			value: data.end_date,
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
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentAttendanceSetting.useQuery({ period_id });
	const filterKey: RowItemKey = "parameters";

	const { selectedTab, open, setOpen, mode, setData } =
		useContext(dataTableContext);

	useEffect(() => {
		if (data && selectedTab === "current") {
			setData({
				...data,
				functions: {
					create: data.creatable,
					update: data.updatable,
					delete: data.deletable,
				},
			});
		}
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
		return emptyError ? (
			<EmptyTable err_msg={err_msg} selectedTableType="TableAttendance" />
		) : (
			<></>
		);
	}

	return (
		<>
			{!viewOnly ? (
				<ParameterToolbarFunctionsProvider
					selectedTableType={"TableAttendance"}
					period_id={period_id}
				>
					<Sheet open={open && mode !== "delete"} onOpenChange={setOpen}>
						<DataTableWithFunctions
							columns={attendance_columns({ t })}
							data={attendanceMapper([data!])}
							filterColumnKey={filterKey}
						/>
						<FunctionsSheetContent t={t} period_id={period_id}>
							<ParameterForm
								formSchema={attendanceSchema}
								formConfig={[{ key: "id", config: { hidden: true } }]}
								mode={mode}
								closeSheet={() => {
									setOpen(false);
								}}
							/>
						</FunctionsSheetContent>
					</Sheet>
					<ConfirmDialog open={open && mode === "delete"} onOpenChange={setOpen} schema={attendanceSchema}/>
				</ParameterToolbarFunctionsProvider>
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
