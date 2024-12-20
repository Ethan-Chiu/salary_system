import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import { DataTable as DataTableWithFunctions } from "../components/data_table_single";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import {
	c_CreateDateStr,
	c_EndDateStr,
	c_StartDateStr,
	c_UpdateDateStr,
} from "../constant";
import { LoadingSpinner } from "~/components/loading";
import { formatDate } from "~/lib/utils/format_date";
import { type TableComponentProps } from "../tables_view";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { InsuranceRateSettingFEType } from "~/server/api/types/insurance_rate_setting_type";
import { TFunction } from "i18next";
import { useContext, useEffect } from "react";
import dataTableContext from "../components/context/data_table_context";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import ParameterToolbarFunctionsProvider from "../components/function_sheet/parameter_functions_context";
import { ParameterForm } from "../components/function_sheet/parameter_form";
import { insuranceSchema } from "../schemas/configurations/insurance_schema";
import { FunctionsSheet } from "../components/function_sheet/functions_sheet";

export type RowItem = {
	parameters: string;
	value: number | string | Date;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const insurance_rate_columns = ({ t }: { t: TFunction<[string], undefined> }) => [
	...["parameters", "value"].map(
		(key: string) => columnHelper.accessor(key as RowItemKey, {
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
];

export function insuranceRateMapper(
	insuranceRateData: InsuranceRateSettingFEType[]
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
			parameters: "二代健保補充保費倍數",
			value: data.v2_h_i_multiplier,
		},
		{
			parameters: c_StartDateStr,
			value: formatDate("day", data.start_date) ?? "",
		},
		{
			parameters: c_EndDateStr,
			value: formatDate("day", data.end_date) ?? "",
		},
		// {
		// 	parameters: c_CreateDateStr,
		// 	value: formatDate("hour", data.create_date) ?? "",
		// },
		// {
		// 	parameters: c_UpdateDateStr,
		// 	value: formatDate("hour", data.update_date) ?? "",
		// },
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
	const { t } = useTranslation(["common"]);
	const { selectedTab, setFunctionsItem } = useContext(dataTableContext);

	const { isLoading, isError, data, error } =
		api.parameters.getCurrentInsuranceRateSetting.useQuery({ period_id });
	const filterKey: RowItemKey = "parameters";

	useEffect(() => {
		setFunctionsItem({
			create: data?.creatable ?? false,
			update: data?.updatable ?? false,
			delete: data?.deletable ?? false,
		});
	}, [data, selectedTab]);

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
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableInsurance" /> : <></>;
	}

	return (
		<>
			{!viewOnly ? (
				<FunctionsSheet t={t} period_id={period_id}>
					<DataTableWithFunctions
						columns={insurance_rate_columns({ t })}
						data={insuranceRateMapper([data!])}
						filterColumnKey={filterKey}
					/>
				</FunctionsSheet>
			) : (
				<DataTableWithoutFunctions
					columns={insurance_rate_columns({ t })}
					data={insuranceRateMapper([data!])}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
