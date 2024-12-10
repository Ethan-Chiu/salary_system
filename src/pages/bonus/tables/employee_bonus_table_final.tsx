import { api } from "~/utils/api";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { I18nType } from "~/lib/utils/i18n_type";
import { useTranslation } from "react-i18next";
import { useContext, useEffect } from "react";
import dataTableContext from "../components/context/data_table_context";
import { EmployeeBonusFEType } from "~/server/api/types/employee_bonus_type";

export type RowItem = EmployeeBonusFEType;
type RowItemKey = keyof RowItem;

interface EmployeeBonusTableProps extends TableComponentProps {
    period_id: number;
    bonus_type: BonusTypeEnumType;
    globalFilter?: string;
    viewOnly?: boolean;
}

const columns = (t: I18nType) =>
    [
        "department",
        "emp_no",
        "emp_name",
        // "special_multiplier",
        // "multiplier",
        // "fixed_amount",
        "bud_effective_salary",
        "bud_amount",
        // "sup_performance_level",
        "sup_effective_salary",
        "sup_amount",
        // "app_performance_level",
        "app_effective_salary",
        "app_amount",
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
