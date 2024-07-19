import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Payset } from "~/server/database/entity/UMEDIA/payset";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType ) => Object.keys(new Payset()).map((key) => {
	return {
		accessorKey: key,
		header: t(`common.table.${key}`),
	};
});

interface PaysetTableProps {
	period: number;
	emp_no_list: string[];
}

export function PaysetTable({ period, emp_no_list }: PaysetTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getPaysetByEmpList.useQuery({
			period_id: period,
			emp_no_list: emp_no_list,
		});

  const { t } = useTranslation(['common']);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns(t)} data={data} />;
}
