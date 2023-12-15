import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import {
	isString,
	isNumber,
	isDate,
} from "~/pages/develop_parameters/utils/checkType";
import { DataTable } from "../components/data_table";
import {
	c_CreateDateStr,
	c_EndDateStr,
	c_StartDateStr,
} from "../constant";
import { InsuranceRateSetting } from "~/server/database/entity/insurance_rate_setting";

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
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Parameter
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="pl-4 w-[400px] lowercase">{row.getValue("name")}</div>
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
			return <div className="flex justify-center"><div className="w-80 text-center font-medium">{formatted}</div></div>;
		},
	}),
];

function insuranceRateMapper(insuranceRateData: InsuranceRateSetting): RowItem[] {
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
			value: new Date(insuranceRateData.start_date),
		},
		{
			name: c_EndDateStr,
			value: insuranceRateData.end_date
				? new Date(insuranceRateData.end_date)
				: new Date(),
		},
		{
			name: c_CreateDateStr,
			value: insuranceRateData.create_date,
		},
	];
}

export function InsuranceRateTable({ index, globalFilter }: any) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentInsuranceRateSetting.useQuery();
	const filterKey: RowItemKey = "name";

	if (isLoading) {
		return <span>Loading</span>; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return (
		<DataTable
			columns={columns}
			data={insuranceRateMapper(data)}
			filterColumnKey={filterKey}
		/>
	);

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);
}
