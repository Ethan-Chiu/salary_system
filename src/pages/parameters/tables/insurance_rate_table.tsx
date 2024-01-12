import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
	isString,
	isNumber,
	isDate,
} from "~/lib/utils/checkType";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr, c_UpdateDateStr } from "../constant";
import { InsuranceRateSetting } from "~/server/database/entity/SALARY/insurance_rate_setting";
import { LoadingSpinner } from "~/components/loading";
import { TABLE_INSURANCE } from "~/pages/table_names";
import {formatDate} from "~/lib/utils/formatDate"


export type RowItem = {
	name: string;
	value: number | string | Date;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

const columns = [
	columnHelper.accessor("name", {
		header: ({ column }) => {
			return (
				<div className="pl-3 flex justify-center">
					<div className="text-center font-medium">
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Parameter
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
				</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="lowercase">
				{row.getValue("name")}
			</div>
		),
	}),
	columnHelper.accessor("value", {
		header: () => <div className="text-center">Value</div>,
		cell: ({ row }) => {
			const value = row.getValue("value");
			let formatted = "";
			if (isNumber(value))
				formatted = parseFloat(row.getValue("value")).toString();
			else if (isString(value)) formatted = row.getValue("value");
			else if (isDate(value)) {
				if (value) {
					formatted =
						(value as Date).toISOString().split("T")[0] ?? "";
				} else formatted = "";
			}
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">
						{formatted}
					</div>
				</div>
			);
		},
	}),
];

function insuranceRateMapper(
	insuranceRateData: InsuranceRateSetting
): RowItem[] {
	return [
		{
			name: "最低薪資率",
			value: insuranceRateData.min_wage_rate,
		},
		{
			name: "勞保事故費率",
			value: insuranceRateData.l_i_accident_rate,
		},
		{
			name: "勞保就業保險費率",
			value: insuranceRateData.l_i_employment_premium_rate,
		},
		{
			name: "勞保職業災害費率",
			value: insuranceRateData.l_i_occupational_hazard_rate,
		},
		{
			name: "勞保工資墊償基金提繳率",
			value: insuranceRateData.l_i_wage_replacement_rate,
		},
		{
			name: "健保一般費率",
			value: insuranceRateData.h_i_standard_rate,
		},
		{
			name: "健保平均眷口數",
			value: insuranceRateData.h_i_avg_dependents_count,
		},
		{
			name: "二代健保補充保費率",
			value: insuranceRateData.v2_h_i_supp_premium_rate,
		},
		{
			name: "二代健保扣繳門檻單次",
			value: insuranceRateData.v2_h_i_dock_tsx_thres,
		},
		{
			name: c_StartDateStr,
			value: formatDate("day", insuranceRateData.start_date),
		},
		{
			name: c_EndDateStr,
			value: insuranceRateData.end_date
				// ? new Date(insuranceRateData.end_date)
				? formatDate("day", insuranceRateData.end_date)
				: "",
		},
		{
			name: c_CreateDateStr,
			value: formatDate("hour", insuranceRateData.create_date),
			// value: insuranceRateData.create_date
		},
		{
			name: c_UpdateDateStr,
			value: formatDate("hour", insuranceRateData.update_date),
			// value: insuranceRateData.create_date
		},
	];
}

export function InsuranceRateTable({ index, globalFilter, viewOnly }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentInsuranceRateSetting.useQuery();
	const filterKey: RowItemKey = "name";

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={columns}
					data={insuranceRateMapper(data)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={columns}
					data={insuranceRateMapper(data)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
