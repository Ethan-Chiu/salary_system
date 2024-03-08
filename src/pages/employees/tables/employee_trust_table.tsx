import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table_update";
import { api } from "~/utils/api";

const columns = [
    "emp_no",
    "emp_trust_reserve",
    "org_trust_reserve",
    "emp_special_trust_incent",
    "org_special_trust_incent",
    "start_date",
    "end_date",
].map((key) => {
    return {
        accessorKey: key,
        header: key,
    };
});

export function EmployeeTrustTable({ index, globalFilter }: any) {
    const { isLoading, isError, data, error } =
        api.employeeTrust.getCurrentEmployeeTrust.useQuery();
    const filterKey = "emp_no";

    if (isLoading) {
        return <LoadingSpinner />; // TODO: Loading element with toast
    }

    if (isError) {
        return <span>Error: {error.message}</span>; // TODO: Error element with toast
    }

    console.log(data!);

    return (
        <DataTable columns={columns} data={data!} filterColumnKey={filterKey} />
    );
}
