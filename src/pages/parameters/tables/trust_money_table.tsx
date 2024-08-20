import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { isString, isNumber, isDateType } from "~/lib/utils/check_type";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { c_CreateDateStr, c_EndDateStr, c_StartDateStr, c_UpdateDateStr } from "../constant";
import { z } from "zod";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../tables_view";
import { formatDate } from "~/lib/utils/format_date";
import { EmptyTable } from "./empty_table";
import { useTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { TrustMoney } from "~/server/database/entity/SALARY/trust_money";

export type RowItem = {
	position: number;
	position_type: string;
	emp_trust_reserve_limit: number | null;
	org_trust_reserve_limit: number;
	emp_special_trust_incent_limit: number | null;
	org_special_trust_incent_limit: number;
};
type RowItemKey = keyof RowItem;

const columnHelper = createColumnHelper<RowItem>();

export const trust_money_columns = ({ t }: { t: TFunction<[string], undefined> }) => [
	columnHelper.accessor("position", {
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
							{t("table.position")}
							<ArrowUpDown className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			);
		},
		cell: ({ row }) => (
			<div className="flex justify-center">
				<div className="text-center font-medium">
					{row.getValue("position")}
				</div>
			</div>
		),
	}),
	columnHelper.accessor("position_type", {
		header: () => {
			return <div className="text-center font-medium">{t("table.position_type")}</div>
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{row.getValue("position_type")}</div>
				</div>
			);
		},
	}),
	columnHelper.accessor("emp_trust_reserve_limit", {
		header: () => {
			return <div className="text-center font-medium">{t("table.emp_trust_reserve_limit")}</div>
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{row.getValue("emp_trust_reserve_limit")}</div>
				</div>
			);
		},
	}),
	columnHelper.accessor("org_trust_reserve_limit", {
		header: () => {
			return <div className="text-center font-medium">{t("table.org_trust_reserve_limit")}</div>
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{row.getValue("org_trust_reserve_limit")}</div>
				</div>
			);
		},
	}),
	columnHelper.accessor("emp_special_trust_incent_limit", {
		header: () => {
			return <div className="text-center font-medium">{t("table.emp_special_trust_incent_limit")}</div>
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{row.getValue("emp_special_trust_incent_limit")}</div>
				</div>
			);
		},
	}),
	columnHelper.accessor("org_special_trust_incent_limit", {
		header: () => {
			return <div className="text-center font-medium">{t("table.org_special_trust_incent_limit")}</div>
		},
		cell: ({ row }) => {
			return (
				<div className="flex justify-center">
					<div className="text-center font-medium">{row.getValue("org_special_trust_incent_limit")}</div>
				</div>
			);
		},
	}),
];

export function trustMoneyMapper(
	TrustMoneyData: TrustMoney[]
): RowItem[] {
	return TrustMoneyData.map((data) => ({
		position: data.position,
		position_type: data.position_type,
		emp_trust_reserve_limit: data.emp_trust_reserve_limit,
		org_trust_reserve_limit: data.org_trust_reserve_limit,
		emp_special_trust_incent_limit: data.emp_special_trust_incent_limit,
		org_special_trust_incent_limit: data.org_special_trust_incent_limit,
	}));
}

interface TrustMoneyTableProps extends TableComponentProps {
	period_id: number;
	globalFilter?: string;
	viewOnly?: boolean;
}

export function TrustMoneyTable({ viewOnly }: TrustMoneyTableProps) {
	const { isLoading, isError, data, error } =
		api.parameters.getCurrentTrustMoney.useQuery();
	const filterKey: RowItemKey = "position";

	const { t } = useTranslation(["common"]);

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
		return emptyError ? <EmptyTable err_msg={err_msg} selectedTableType="TableTrustMoney" /> : <></>;
	}

	return (
		<>
			{!viewOnly ? (
				<DataTableWithFunctions
					columns={trust_money_columns({ t: t })}
					data={trustMoneyMapper(data!)}
					filterColumnKey={filterKey}
				/>
			) : (
				<DataTableWithoutFunctions
					columns={trust_money_columns({ t: t })}
					data={trustMoneyMapper(data!)}
					filterColumnKey={filterKey}
				/>
			)}
		</>
	);
}
