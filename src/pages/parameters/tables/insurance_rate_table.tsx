import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import {
	c_CreateDateStr,
	c_EndDateStr,
	c_StartDateStr,
	c_UpdateDateStr,
} from "../constant";
import { type InsuranceRateSetting } from "~/server/database/entity/SALARY/insurance_rate_setting";
import { LoadingSpinner } from "~/components/loading";
import { formatDate } from "~/lib/utils/format_date";
import { type TableComponentProps } from "../tables_view";
import { EmptyTable } from "./empty_table";
import { Translate } from "~/lib/utils/translation";

export type RowItem = {
	parameters: string;
	value: number | string | Date;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const insurance_rate_columns = [
	columnHelper.accessor("parameters", {
		header: ({ column }) => {
			return (
				<div className="flex justify-center pl-3">
					<div className="text-center font-medium">
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(
									column.getIsSorted() === "asc"
								)
							}
						>
							{Translate("parameters")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">{row.getValue("parameters")}</div>
		),
	}),
	columnHelper.accessor("value", {
		header: () => <div className="text-center">{Translate("Value")}</div>,
		cell: ({ row }) => {
			const value = row.getValue("value");
			let formatted = "";
			if (isNumber(value))
				formatted = parseFloat(row.getValue("value")).toString();
			else if (isString(value)) formatted = row.getValue("value");
			else if (isDateType(value)) {
				if (value) {
					formatted =
						value.toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{formatted}</div>
				</div>
			);
		},
	}),
];

export function insuranceRateMapper(
	insuranceRateData: InsuranceRateSetting[]
): RowItem[] {
	const data = insuranceRateData[0]!;
	return [
		{
			parameters: "最低薪資率",
			value: data.min_wage_rate,
		},
		{
			parameters: "勞保事故費率",
			value: data.l_i_accident_rate,
		},
		{
			parameters: "勞保就業保險費率",
			value: data.l_i_employment_pay_rate,
		},
		{
			parameters: "勞保職業災害費率",
			value: data.l_i_occupational_injury_rate,
		},
		{
			parameters: "勞保工資墊償基金提繳率",
			value: data.l_i_wage_replacement_rate,
		},
		{
			parameters: "健保一般費率",
			value: data.h_i_standard_rate,
		},
		{
			parameters: "健保平均眷口數",
			value: data.h_i_avg_dependents_count,
		},
		{
			parameters: "二代健保補充保費率",
			value: data.v2_h_i_supp_pay_rate,
		},
		{
			parameters: "二代健保扣繳門檻單次",
			value: data.v2_h_i_deduction_tsx_thres,
		},
		{
			parameters: c_StartDateStr,
			value: formatDate("day", data.start_date),
		},
		{
			parameters: c_EndDateStr,
			value: data.end_date ? formatDate("day", data.end_date) : "",
		},
		{
			parameters: c_CreateDateStr,
			value: formatDate("hour", data.create_date),
		},
		{
			parameters: c_UpdateDateStr,
			value: formatDate("hour", data.update_date),
		},
	];
}


interface InsuranceRateTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}
export function InsuranceRateTable({
	period_id,
	viewOnly,
}: InsuranceRateTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentInsuranceRateSetting.useQuery({ period_id });
	const filterKey: RowItemKey = "parameters";

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
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableInsurance"  /> : <></>;
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={insurance_rate_columns}
					data={insuranceRateMapper([data])}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={insurance_rate_columns}
					data={insuranceRateMapper([data])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
