import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { Holiday } from "~/server/database/entity/UMEDIA/holiday";
import { api } from "~/utils/api";
import { type I18nType} from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { HolidayFE } from "~/server/api/types/holiday_type";

const columns = (t: I18nType) => Object.keys(HolidayFE.shape).map((key) => {
	return {
		accessorKey: key,
		header: t(`table.${key}`),
	};
});

interface HolidayTableProps {
	period: number;
	emp_no_list: string[];
}

export function HolidayTable({ period, emp_no_list }: HolidayTableProps) {
	const { isLoading, isError, data, error } =
		api.function.getHolidayWithTypeByEmpNoList.useQuery({
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
