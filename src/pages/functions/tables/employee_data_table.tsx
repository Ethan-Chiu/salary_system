import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table_advanced_filter";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
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
	].map((key) => {
		const header = ({ column }: { column: any }) => {
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
		}
		if (key === "registration_date" || key === "quit_date") {
			return {
				accessorKey: key,
				header: header,
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
		if (key === "work_type") {
			return {
				accessorKey: key,
				header: header,
				filterFn: 'arrIncludesSome',
			};
		}
		return {
			accessorKey: key,
			header: header,
		};
	});

interface EmployeeDataTableProps {
	period_id: number;
	func: any;
}

export function EmployeeDataTable({ period_id, func }: EmployeeDataTableProps) {
	const { isLoading, isError, data, error } =
		api.sync.getPaidEmployees.useQuery({ period_id, func });

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		return <DataTable columns={columns(t)} data={data} />;
	}
	return <div />;
}
