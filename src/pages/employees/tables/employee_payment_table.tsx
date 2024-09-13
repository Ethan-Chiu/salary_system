import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table_update";
import { api } from "~/utils/api";
import { type I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";

import {
	useContext,
	createContext,
	useEffect,
	useState,
	createRef,
} from "react";
import employeePaymentRefetchContext from "../components/context/employee_payment_context";
import { Button } from "~/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { employeeToolbarFunctionsContext } from "../components/function_sheet/employee_functions_context";

const columns = (t: I18nType) =>
	[
		"emp_no",
		"emp_name",
		"position",
		"position_type",
		"department",
		"base_salary",
		"food_allowance",
		"supervisor_allowance",
		"occupational_allowance",
		"subsidy_allowance",
		"l_r_self",
		"l_i",
		"h_i",
		"l_r",
		"occupational_injury",
		"start_date",
		"end_date",
	].map((key) => {
		return {
			accessorKey: key,
			header: t(`table.${key}`),
		};
	});

export function EmployeePaymentTable({ period_id }: any) {

	const [val, setVal] = useState(true);

	const { isLoading, isFetched, isError, data, error, refetch, isStale, status } =
		api.employeePayment.getCurrentEmployeePayment.useQuery({ period_id }, {
			staleTime: 10000
		});

	const { t } = useTranslation(["common"]);

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	const refetch_button = createRef<HTMLButtonElement>();


	if (data) {
		return (
			<>
				<Button className="" onClick={() => {
					// refetch();
				}} ref={refetch_button}>
						refetch
				</Button>
				<employeePaymentRefetchContext.Provider
					value={() => {
						// if (isStale) refetch();
						refetch();
					}}
				>
					{isFetched ? (
						<DataTable columns={columns(t)} data={data} />
					) : (
						<LoadingSpinner />
					)}
				</employeePaymentRefetchContext.Provider>
			</>
		);
	}
	return <div />;
}
