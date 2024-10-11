import { api } from "~/utils/api";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../bonus_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { useContext, useEffect } from "react";
import dataTableContext from "../components/context/data_table_context";

export type RowItem = {
    emp_no: string,
    special_multiplier: number,
    multiplier: number,
    fixed_amount: number,
    budget_amount: number,
    supervisor_amount: number,
    approved_amount: number,
};
type RowItemKey = keyof RowItem;

interface EmployeeBonusTableProps extends TableComponentProps {
    period_id: number;
    bonus_type: BonusTypeEnumType;
    globalFilter?: string;
    viewOnly?: boolean;
}

const columns = (t: I18nType) =>
    [
        "emp_no",
        "special_multiplier",
        "multiplier",
        "fixed_amount",
        "budget_effective_salary",
        "budget_amount",
        "supervisor_performance_level",
        "supervisor_effective_salary",
        "supervisor_amount",
        "approved_performance_level",
        "approved_effective_salary",
        "approved_amount",
    ].map((key) => {
        return {
            accessorKey: key,
            header: t(`table.${key}`),
        };
    });

export function EmployeeBonusTable({ period_id, bonus_type, viewOnly }: EmployeeBonusTableProps) {
    const { isLoading, isError, data, error } =
        api.bonus.getAllEmployeeBonus.useQuery({ period_id, bonus_type });
    const filterKey: RowItemKey = "emp_no";
    const { t } = useTranslation(["common"]);
    const { setSelectedTableType } = useContext(dataTableContext);

    useEffect(() => {
        setSelectedTableType("TableEmployeeBonus");
    }, []);

    if (isLoading) {
        return (
            <div className="flex grow items-center justify-center">
                <LoadingSpinner />
            </div>
        ); // TODO: Loading element with toast
    }

    if (isError) {
        return <span>Error: {error.message}</span>; // TODO: Error element with toast
    }

    return (
        <>
            {!viewOnly ? (
                <DataTableWithFunctions
                    columns={columns(t)}
                    data={data!}
                    bonusType={bonus_type}
                    filterColumnKey={filterKey}
                />
            ) : (
                <DataTableWithoutFunctions
                    columns={columns(t)}
                    data={data!}
                    filterColumnKey={filterKey}
                />
            )}
        </>
    );
}
