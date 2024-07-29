import React from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "~/components/loading";
import { FunctionsEnumType } from "~/server/api/types/functions_enum";
import { api } from "~/utils/api";

import { useEffect } from "react";
import { Period } from "~/server/database/entity/UMEDIA/period";

export function SalaryCalculatePage({
    period,
    func,
}: {
    period: Period;
    func: FunctionsEnumType,
}) {
    const { isLoading, isError, data, error } = api.sync.getPaidEmployees.useQuery({ func })

    if (isLoading) {
        return <LoadingSpinner />; // TODO: Loading element with toast
    }

    if (isError) {
        return <span>Error: {error.message}</span>; // TODO: Error element with toast
    }
    if (data) {
        return <SalaryCalculateContent period={period} emp_no_list={data.map(emp => emp.emp_no)} />
    }
    return <div />
}

function SalaryCalculateContent({
    period,
    emp_no_list,
}: {
    period: Period,
    emp_no_list: string[],
}) {
    // const { isLoading, isError, data, error } = api.calculate.calculateWeekdayOvertimePay.useQuery({ emp_no: emp_no_list[0]!, period_id: period })

    const createTransaction = api.transaction.createTransaction.useMutation({
        onSuccess: () => {
            console.log("success")
        },
        onError: () => {
            console.log("error")
        }
    })

    useEffect(() => {
        try {
            createTransaction.mutate({ emp_no_list: emp_no_list, period_id: period.period_id, issue_date: period.issue_date, pay_type: "month_salary", note: "計算月薪"});   
        }
        catch (error) {
            console.log(error)
        }
    }, []);

    const { t } = useTranslation(['common'])

    if (createTransaction.isPending) {
        return <LoadingSpinner />; // TODO: Loading element with toast
    }

    if (createTransaction.isError) {
        return <span>Error: {createTransaction.error.message}</span>; // TODO: Error element with toast
    }

    return <div>{t("others.calculate_done")}</div>
}
