import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const columns = (t: I18nType) =>
	[
		// "period_name",
		"department",
		"emp_no",
		"emp_name",
		"position",
		"work_day",

		// "主管職務補助輪班證照久任"
		"supervisor_allowance",
		"occupational_allowance",
		"subsidy_allowance",
		"shift_allowance",
		"professional_cert_allowance",
		"long_service_allowance"

		// "amount",
		// "remark",
		// "pay_delay"
	].map((key) => {
		return {
			accessorKey: key,
			header: ({ column }: any) => {
				const { t } = useTranslation(["common"]);
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

interface AllowanceTableProps {
	period_id: number;
	emp_no_list: string[];
}

export function AllowanceTable({ period_id, emp_no_list }: AllowanceTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getNewAllowanceFEByEmpNoList.useQuery({
			period_id: period_id,
			emp_no_list: emp_no_list,
		});

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		const filteredData = data.filter((d: any) =>
			["supervisor_allowance",
				"occupational_allowance",
				"subsidy_allowance",
				"shift_allowance",
				"professional_cert_allowance",
				"long_service_allowance"]
				.some(key => d[key] > 0)
		);
		return <DataTable columns={columns(t)} data={filteredData} />;
	}
	return <div />;
}
