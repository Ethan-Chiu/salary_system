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

const columnHelper = createColumnHelper<EmployeeTrustFEType>();

const columnNames: (keyof EmployeeTrustFEType)[] = [
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
const columns = (t: I18nType) =>
	columnNames.map((key) => {
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
		if (key === "start_date" || key === "end_date") {
			return columnHelper.accessor(key, {
				header: header,
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
			header: header,
		});
	});

export function EmployeeTrustTable({ period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({
			period_id: period_id,
		});

	const { t } = useTranslation(["common"]);

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
				columns={columns(t)}
				columnNames={columnNames}
				data={data}
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
