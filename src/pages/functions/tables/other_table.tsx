import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { ExpenseWithType } from "~/server/service/ehr_service";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType) =>
	[
		"period_name",
		"emp_no",
		"emp_name",
		"kind",
		"expense_type_name",
		"amount",
		"remark",
		"pay_delay"
	].map((key) => {
		return {
			accessorKey: key,
			header: t(`table.${key}`),
		};
	});

interface OtherTableProps {
	period: number;
	emp_no_list: string[];
}

export function OtherTable({ period, emp_no_list }: OtherTableProps) {
	// const { isLoading, isError, data, error } =
	// 	api.function.getBonusWithTypeByEmpList.useQuery({
	// 		period_id: period,
	// 		emp_no_list: emp_no_list,
	// 	});

	const { isLoading, isError, data, error } =
		api.function.getExpenseWithTypeByEmpList.useQuery({
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
