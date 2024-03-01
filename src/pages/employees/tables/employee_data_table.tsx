import { LoadingSpinner } from "~/components/loading";
import { DataTable } from "../components/data_table";
import { api } from "~/utils/api";
import { EmployeeData } from "~/server/database/entity/SALARY/employee_data";

const columns = Object.keys(new EmployeeData()).map((key) => {
    return {
        accessorKey: key,
        header: key,
    };
});

export function EmployeeDataTable({ index, globalFilter }: any) {
    const { isLoading, isError, data, error } =
        api.employeeData.getAllEmployeeData.useQuery();
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
