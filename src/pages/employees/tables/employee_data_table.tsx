import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import i18n from "~/lib/utils/i18n";

const columns = () => [
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
	"month_salary",
].map((key) => {
	return {
		accessorKey: key,
		header: i18n.t(`common.table.${key}`),
	};
});

export function EmployeeDataTable({ index, globalFilter, period_id }: any) {
	const { isLoading, isError, data, error } =
		api.employeeData.getAllEmployeeDataWithInfo.useQuery({ period_id });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return <DataTable columns={columns()} data={data!} />;
}
