import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { HistoryView } from "../../components/history_view/history_view";
import { employee_trust_columns } from "./employee_trust_table";
import { useTranslation } from "react-i18next";

export function EmployeeTrustHistory() {
	const { t } = useTranslation(["common"]);
  
	/* const { isPending, isError, data, error } = */
 /*    api.employeeTrust.getAllEmployeeTrust.useQuery() */
	/**/
	/* if (isPending) { */
	/* 	return <LoadingSpinner />; // TODO: Loading element with toast */
	/* } */
	/**/
	/* if (isError) { */
	/* 	return <span>Error: {error.message}</span>; // TODO: Error element with toast */
	/* } */

  return <HistoryView columns={employee_trust_columns({ t })} dataFunction={() => api.employeeTrust.getAllEmployeeTrust.useQuery()} /> 
}
