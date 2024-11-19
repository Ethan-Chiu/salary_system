import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { ExpenseWithType } from "~/server/service/ehr_service";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";

/*
    emp_no: z.string(),
    emp_name: z.string(),
    department: z.string(),
    position: z.number(),
    other_addition: z.number(),
    other_addition_tax: z.number(),
    other_deduction: z.number(),
    other_deduction_tax: z.number(),
    dorm_deduction: z.number(),
    g_i_deduction_promotion: z.number(),
    g_i_deduction_family: z.number(),
    income_tax_deduction: z.number(),
    l_r_self: z.number(),
    parking_fee: z.number(),
    brokerage_fee: z.number(),
    retirement_income: z.number(),
    l_i_disability_reduction: z.number(),
    h_i_subsidy: z.number(),	

*/

const columns = (t: I18nType) =>
	[
		// "period_name",
		// "emp_no",
		// "emp_name",
		// "kind",
		// "id",
		// "expense_type_name",
		// "amount",
		// "remark",
		// "pay_delay"

		"department",
		"emp_no",
		"emp_name",
		"position",
		"work_day",
		"other_addition",
		"other_addition_tax",
		"other_deduction",
		"other_deduction_tax",
		"dorm_deduction",
		"g_i_deduction_promotion",
		"g_i_deduction_family",
		"income_tax_deduction",
		"l_r_self",
		"parking_fee",
		"brokerage_fee",
		"retirement_income",
		"l_i_disability_reduction",
		"h_i_subsidy",
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

interface OtherTableProps {
	period: number;
	emp_no_list: string[];
}

export function OtherTable({ period, emp_no_list }: OtherTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getNewOtherByEmpNoList.useQuery({
			period_id: period,
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
		return <DataTable columns={columns(t)} data={data} />;
	}
	return <div />;
}
