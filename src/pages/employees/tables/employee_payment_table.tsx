import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "~/lib/utils/format_date";
import { createColumnHelper } from "@tanstack/react-table";
import { type EmployeePaymentFEType } from "~/server/api/types/employee_payment_type";

const columnHelper = createColumnHelper<EmployeePaymentFEType>();

const columnNames: (keyof EmployeePaymentFEType)[] = [
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
const columns = (t: I18nType) =>
	columnNames.map((key) => {
		if (key === "start_date" || key === "end_date") {
			return columnHelper.accessor(key, {
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
					const value: Date = row.getValue(key);
					return (
						<div className="flex justify-center">
							<div className="text-center font-medium">
								{formatDate("day", value)}
							</div>
						</div>
					);
				},
			});
		}
		return columnHelper.accessor(key, {
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
		});
	});

export function EmployeePaymentTable({ period_id }: any) {
	const { isLoading, isFetched, isError, data, error } =
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id });

	const { t } = useTranslation(["common"]);

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
						columns={columns(t)}
						columnNames={columnNames}
						data={data}
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
