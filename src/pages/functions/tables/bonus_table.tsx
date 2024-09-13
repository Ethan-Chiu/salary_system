import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { BonusWithType } from "~/server/service/ehr_service";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { PayTypeEnumType } from "~/server/api/types/pay_type_enum";

const columns = (t: I18nType) =>
	[
		"period_name",
		"emp_no",
		"emp_name",
		"bonus_type_name",
		"amount",
		"pay",
		"remark",
	].map((key) => {
		return {
			accessorKey: key,
			header: t(`table.${key}`),
		};
	});

interface BonusTableProps {
	period: number;
	emp_no_list: string[];
	pay_type: PayTypeEnumType;
}

export function BonusTable({ period, emp_no_list, pay_type }: BonusTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getBonusWithTypeByEmpNoList.useQuery({
			period_id: period,
			emp_no_list: emp_no_list,
			pay_type: pay_type,
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
