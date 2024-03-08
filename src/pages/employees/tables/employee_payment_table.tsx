import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { EmployeeTrust } from "~/server/database/entity/SALARY/employee_trust";

const columns = Object.keys(new EmployeeTrust()).map((key) => {
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

    return (
        <DataTable columns={columns} data={data!} filterColumnKey={filterKey} />
    );
}
