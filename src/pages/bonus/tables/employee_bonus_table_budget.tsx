import { api } from "~/utils/api";
import { DataTable as DataTableWithFunctions } from "../components/data_table";
import { DataTable as DataTableWithoutFunctions } from "~/pages/functions/components/data_table";
import { LoadingSpinner } from "~/components/loading";
import { type TableComponentProps } from "../pre_calculate_bonus/bonus_filter";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import dataTableContext from "../components/context/data_table_context";
import { Button } from "~/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EmployeeBonusFEType } from "~/server/api/types/employee_bonus_type";
import { FunctionMode } from "../components/function_sheet/data_table_functions_single";
import { TFunction } from "i18next";
import { FunctionsComponent, FunctionsItem } from "~/components/data_table/functions_component";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import BonusToolbarFunctionsProvider from "../components/function_sheet/bonus_functions_context";
import { BonusForm } from "../components/function_sheet/bonus_form";
import { employeeBonusSchema } from "../schemas/configurations/employee_bonus_schema";

export type RowItem = EmployeeBonusFEType & {
    functions: FunctionsItem;
};
type RowItemKey = keyof RowItem;
const columnHelper = createColumnHelper<RowItem>();

const employee_bonus_budget_columns = ({ t, period_id, bonus_type, open, setOpen, mode, setMode }: { t: TFunction<[string], undefined>, period_id: number, bonus_type: BonusTypeEnumType, open: boolean, setOpen: (open: boolean) => void, mode: FunctionMode, setMode: (mode: FunctionMode) => void }) => [
    ...[
        "department",
        "emp_no",
        "emp_name",
        "base_salary",
        "food_allowance",
        "supervisor_allowance",
        "occupational_allowance",
        "subsidy_allowance",
        "long_service_allowance",
        "special_multiplier",
        "multiplier",
        "fixed_amount",
        "bud_effective_salary",
        "bud_amount",
    ].map(
        (key: string) => columnHelper.accessor(key as RowItemKey, {
            header: ({ column }) => {
                return (
                    <div className="flex justify-center">
                        <div className="text-center font-medium">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    column.toggleSorting(
                                        column.getIsSorted() === "asc"
                                    )
                                }
                            >
                                {t(`table.${key}`)}
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                );
            },
            cell: ({ row }) => {
                switch (key) {
                    default:
                        return <div className="text-center font-medium">{`${row.original[key as RowItemKey]}`}</div>
                }
            }
        })),
    columnHelper.accessor("functions", {
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <div className="text-center font-medium">
                        {t(`others.functions`)}
                    </div>
                </div>
            );
        },
        cell: ({ row }) => {
            return (
                <FunctionsComponent t={t} open={open} setOpen={setOpen} mode={mode} setMode={setMode} functionsItem={row.original.functions} >
                    <BonusToolbarFunctionsProvider
                        selectedTableType={"TableEmployeeBonus"}
                        bonus_type={bonus_type}
                        period_id={period_id}
                    >
                        <ScrollArea className="h-full w-full">
                            <BonusForm
                                formSchema={employeeBonusSchema}
                                bonus_type={bonus_type}
                                mode={mode}
                                closeSheet={() => setOpen(false)}
                            />
                        </ScrollArea>
                        <ScrollBar orientation="horizontal" />
                    </BonusToolbarFunctionsProvider>
                </FunctionsComponent>
            );
        },
    }),
];

export function employeeBonusMapper(employeeBonusData: EmployeeBonusFEType[]): RowItem[] {
    return employeeBonusData.map((d) => {
        return {
            ...d,
            functions: { create: true, update: false, delete: false }
            // functions: { create: d.creatable, update: d.updatable, delete: d.deletable }
        };
    });
}

interface EmployeeBonusTableProps extends TableComponentProps {
    period_id: number;
    bonus_type: BonusTypeEnumType;
    globalFilter?: string;
    viewOnly?: boolean;
}

export function EmployeeBonusTable({ period_id, bonus_type, viewOnly }: EmployeeBonusTableProps) {
    const { t } = useTranslation(["common"]);
    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<FunctionMode>("none");

    const ctx = api.useUtils();
    const initFunction = api.bonus.initCandidateEmployeeBonus.useMutation({
        onSuccess: () => {
            void ctx.bonus.getEmployeeBonus.invalidate();
        },
    });
    const { isLoading, isError, data, error } =
        api.bonus.getEmployeeBonus.useQuery({ period_id, bonus_type });
    const filterKey: RowItemKey = "emp_no";
    const { setSelectedTableType } = useContext(dataTableContext);

    useEffect(() => {
        setSelectedTableType("TableEmployeeBonus");
        initFunction.mutate({ period_id, bonus_type });
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
            {/* <Button onClick={() => console.log(data)}>debug</Button> */}
            {!viewOnly ? (
                <DataTableWithFunctions
                    columns={employee_bonus_budget_columns({ t, period_id, bonus_type, open, setOpen, mode, setMode })}
                    data={employeeBonusMapper(data!)}
                    bonusType={bonus_type}
                    filterColumnKey={filterKey}
                />
            ) : (
                <DataTableWithoutFunctions
                    columns={employee_bonus_budget_columns({ t, period_id, bonus_type, open, setOpen, mode, setMode })}
                    data={employeeBonusMapper(data!)}
                    filterColumnKey={filterKey}
                />
            )}
        </>
    );
}
