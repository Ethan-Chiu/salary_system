import React from "react";
import { LoadingSpinner } from "~/components/loading";
import { FunctionsEnumType } from "~/server/api/types/functions_enum";
import { api } from "~/utils/api";

export function SalaryCalculatePage({
    period,
    func,
}: {
    period: number;
    func: FunctionsEnumType,
}) {
    const { isLoading, isError, data, error } = api.sync.getPaidEmployees.useQuery({ func })

    if (isLoading) {
        return <LoadingSpinner />; // TODO: Loading element with toast
    }

    if (isError) {
        return <span>Error: {error.message}</span>; // TODO: Error element with toast
    }

    return <SalaryCalculateContent period={period} emp_no_list={data.map(emp => emp.emp_no)} />
}

function SalaryCalculateContent({
    period,
    emp_no_list,
}: {
    period: number,
    emp_no_list: string[],
}) {
    const { isLoading, isError, data, error } = api.calculate.calculateWeekdayOvertimePay.useQuery({ emp_no: emp_no_list[0]!, period_id: period })

    if (isLoading) {
        return <LoadingSpinner />; // TODO: Loading element with toast
    }

    if (isError) {
        return <span>Error: {error.message}</span>; // TODO: Error element with toast
    }

    return <div>Done</div>
}
