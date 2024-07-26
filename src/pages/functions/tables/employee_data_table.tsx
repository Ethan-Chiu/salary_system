import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

const columns = (t: I18nType) => [
	"emp_no",
	"emp_name",
	"position",
	"position_type",
	"group_insurance_type",
	"department",
	"work_type",
	"work_status",
	"disabilty_level",
	"sex_type",
	"dependents",
	"healthcare_dependents",
	"registration_date",
	"quit_date",
	"license_id",
	"bank_account",
].map((key) => {
	return {
		accessorKey: key,
		header: t(`table.${key}`),
	};
});

interface EmployeeDataTableProps {
	func: any;
}

export function EmployeeDataTable({ func }: EmployeeDataTableProps) {
	const { isLoading, isError, data, error } =
		api.sync.getPaidEmployees.useQuery({ func });

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
	return <div />;
}
