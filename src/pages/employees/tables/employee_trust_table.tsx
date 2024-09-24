import { LoadingSpinner } from "~/components/loading";
import { DataTableUpdate } from "../components/data_table_update";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType) =>
	[
		"emp_no",
		"emp_name",
		"position",
		"position_type",
		"department",
		"emp_trust_reserve",
		"org_trust_reserve",
		"emp_special_trust_incent",
		"org_special_trust_incent",
		"start_date",
		"end_date",
	].map((key) => {
		return {
			accessorKey: key,
			header: t(`table.${key}`),
		};
	});

export function EmployeeTrustTable({ period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeeTrust.getCurrentEmployeeTrust.useQuery({
			period_id: period_id,
		});

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (data) {
		// TODO: figure out its type
		return (
			<DataTableUpdate
				columns={columns(t)}
				data={data}
				historyDataFunction={() =>
					api.employeeTrust.getAllEmployeeTrust.useQuery()
				}
			/>
		);
	}
	return <div />;
}
