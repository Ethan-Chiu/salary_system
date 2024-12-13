import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeeTrustFEType } from "~/server/api/types/employee_trust_type";
import { formatDate } from "~/lib/utils/format_date";
import { FunctionsComponent, FunctionsItem } from "~/components/data_table/functions_component";
import { TFunction } from "i18next";
import { FunctionMode } from "../components/function_sheet/data_table_functions";
import EmployeeToolbarFunctionsProvider from "../components/function_sheet/employee_functions_context";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { EmployeeForm } from "../components/function_sheet/employee_form";
import { employeeTrustSchema } from "../schemas/configurations/employee_trust_schema";
import { useState } from "react";

export type RowItem = Omit<EmployeeTrustFEType, "start_date" | "end_date"> & {
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
	"emp_trust_reserve",
	"org_trust_reserve",
	"emp_special_trust_incent",
	"org_special_trust_incent",
	"start_date",
	"end_date",
];
export const employee_trust_columns = ({ t, period_id, open, setOpen, mode, setMode }: { t: TFunction<[string], undefined>, period_id: number, open: boolean, setOpen: (open: boolean) => void, mode: FunctionMode, setMode: (mode: FunctionMode) => void }) => [
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
						tableType={"TableEmployeeTrust"}
						period_id={period_id}
					>
						<ScrollArea className="h-full w-full">
							<EmployeeForm
								formSchema={employeeTrustSchema}
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

export function employeeTrustMapper(t: TFunction<[string], undefined>, employeeTrustData: EmployeeTrustFEType[]): RowItem[] {
	return employeeTrustData.map((d) => {
		return {
			...d,
			start_date: formatDate("day", d.start_date) ?? "",
			end_date: formatDate("day", d.end_date) ?? "",
			functions: { create: d.creatable, update: d.updatable, delete: d.deletable }
		};
	});
}

export function EmployeeTrustTable({ period_id }: any) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");

	const { isLoading, isError, data, error } =
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({
			period_id: period_id,
		});

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		// TODO: figure out its type
		return (
			<DataTableUpdate
				columns={employee_trust_columns({ t, period_id, open, setOpen, mode, setMode })}
				columnNames={columnNames}
				data={employeeTrustMapper(t, data)}
				historyDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
				calendarDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
			/>
		);
	}
	return <div />;
}
