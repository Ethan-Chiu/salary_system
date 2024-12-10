import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeePaymentFEType } from "~/server/api/types/employee_payment_type";
import { FunctionsComponent, FunctionsItem } from "~/components/data_table/functions_component";
import { useState } from "react";
import { FunctionMode } from "../components/function_sheet/data_table_functions";
import { TFunction } from "i18next";
import { formatDate } from "~/lib/utils/format_date";
import { EmployeeForm } from "../components/function_sheet/employee_form";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { employeePaymentSchema } from "../schemas/configurations/employee_payment_schema";
import EmployeeToolbarFunctionsProvider from "../components/function_sheet/employee_functions_context";

export type RowItem = Omit<EmployeePaymentFEType, "start_date" | "end_date" | "long_service_allowance_type"> & {
	long_service_allowance_type: string;
	start_date: string;
	end_date: string | null;
	functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columnNames: RowItemKey[] = [
	"department",
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"base_salary",
	"food_allowance",
	"supervisor_allowance",
	"occupational_allowance",
	"subsidy_allowance",
	"long_service_allowance",
	"long_service_allowance_type",
	"l_r_self",
	"l_i",
	"h_i",
	"l_r",
	"occupational_injury",
	"start_date",
	"end_date",
];

export const employee_payment_columns = ({ t, period_id, open, setOpen, mode, setMode }: { t: TFunction<[string], undefined>, period_id: number, open: boolean, setOpen: (open: boolean) => void, mode: FunctionMode, setMode: (mode: FunctionMode) => void }) => [
	...columnNames.map((key: string) =>
		columnHelper.accessor(key as RowItemKey, {
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
					case "end_date":
						return row.original.end_date ? (
							<div className="text-center font-medium">{`${row.original.end_date}`}</div>
						) : (
							<div className="text-center font-medium"></div>
						);
					default:
						return <div className="text-center font-medium">{`${row.original[key as RowItemKey]}`}</div>
				}
			}
		})),
	columnHelper.accessor("functions", {
		header: ({ column }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">
						{t(`others.functions`)}
					</div>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<FunctionsComponent t={t} open={open} setOpen={setOpen} mode={mode} setMode={setMode} functionsItem={row.original.functions} >
					<EmployeeToolbarFunctionsProvider
						tableType={"TableEmployeePayment"}
						period_id={period_id}
					>
						<ScrollArea className="h-full w-full">
							<EmployeeForm
								formSchema={employeePaymentSchema}
								mode={mode}
								closeSheet={() => setOpen(false)}
								columns={null}
							/>
						</ScrollArea>
						<ScrollBar orientation="horizontal" />
					</EmployeeToolbarFunctionsProvider>
				</FunctionsComponent>
			);
		},
	}),
]

export function employeePaymentMapper(t: TFunction<[string], undefined>, employeePaymentData: EmployeePaymentFEType[]): RowItem[] {
	return employeePaymentData.map((d) => {
		return {
			...d,
			long_service_allowance_type: t(`long_service_allowance_type.${d.long_service_allowance_type}`),
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
			functions: { create: d.creatable, update: d.updatable, delete: d.deletable }
		};
	});
}

export function EmployeePaymentTable({ period_id }: any) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	const { isLoading, isFetched, isError, data, error } =
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		return (
			<>
				{isFetched ? (
					// TODO: figure out its type
					<DataTableUpdate
						columns={employee_payment_columns({ t, period_id, open, setOpen, mode, setMode })}
						columnNames={columnNames}
						data={employeePaymentMapper(t, data)}
						historyDataFunction={() =>
							api.employeePayment.getAllEmployeePayment.useQuery()
						}
						calendarDataFunction={() =>
							api.employeePayment.getAllEmployeePayment.useQuery()
						}
					/>
				) : (
					<LoadingSpinner />
				)}
			</>
		);
	}
	return <div />;
}
