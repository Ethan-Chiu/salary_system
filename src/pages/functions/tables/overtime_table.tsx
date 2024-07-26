import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Overtime } from "~/server/database/entity/UMEDIA/overtime";
import { api } from "~/utils/api";
import { type I18nType} from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType) => Object.keys(new Overtime()).map((key) => {
	return {
		accessorKey: key,
		header: t(`table.${key}`),
	};
});

interface OvertimeTableProps {
	period: number;
	emp_no_list: string[];
}

export function OvertimeTable({ period, emp_no_list }: OvertimeTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getOvertimeByEmpList.useQuery({
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

  if (data) {
    return <DataTable columns={columns(t)} data={data} />;
  }
  return <div/>;
}
