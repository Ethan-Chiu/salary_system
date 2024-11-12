import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type Column } from "@tanstack/react-table";
import { formatDate } from "~/lib/utils/format_date";

const columns = (t: I18nType) =>
	[
		"department",
		"emp_no",
		"emp_name",
		"position",
		"position_type",
		"group_insurance_type",
		"work_type",
		"work_status",
		"disabilty_level",
		"sex_type",
		"dependents",
		"healthcare_dependents",
		"registration_date",
		"quit_date",
		"license_id",
		"bank_account",
		"month_salary",
	].map((key) => {
		if (key === "registration_date" || key === "quit_date") {
			return {
				accessorKey: key,
				header: ({ column }: any) => {
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
				cell: ({ row }: any) => {
					const value = row.getValue(key) as string;
					return (
						<div className="flex justify-center">
							<div className="text-center font-medium">
								{formatDate("day", value)}
							</div>
						</div>
					);
				},
			};
		}
		return {
			accessorKey: key,
			header: ({ column }: { column: Column<any, any> }) => {
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
		};
	});

export function EmployeeDataTable({ period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeeData.getAllEmployeeDataWithInfo.useQuery({ period_id });

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		return (
			<DataTable
				columns={columns(t)}
				data={data}
				initialColumnVisibility={{ month_salary: false }}
			/>
		);
	}

	return <div> </div>;
}
