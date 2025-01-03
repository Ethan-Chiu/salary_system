import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";
import { useTranslation } from "react-i18next";
import { MonthSalaryStatusEnum } from "~/server/api/types/month_salary_status_enum";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

function resetFilter(table: Table<any>) {
    table.getColumn("month_salary_status")?.setFilterValue("");
}

function getFilterFunctionByValue<TData>(table: Table<TData>, value: string) {
    switch (value) {
        case "all":
            return table.getColumn("month_salary_status")?.setFilterValue("");
        case "month_salary_unpaid":
            return table.getColumn("month_salary_status")?.setFilterValue(MonthSalaryStatusEnum.Enum.未發放月薪);
        case "month_salary_paid":
            return table.getColumn("month_salary_status")?.setFilterValue(MonthSalaryStatusEnum.Enum.已發放月薪);
        case "leave":
            return table.getColumn("month_salary_status")?.setFilterValue(MonthSalaryStatusEnum.Enum.離職人員);
        default:
            return table.setGlobalFilter("");
    }
}

export function AdvancedFilter<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation(['common']);
    return (
        <Select defaultValue="all" onValueChange={value => {
            resetFilter(table);
            getFilterFunctionByValue(table, value)
        }}>
            <SelectTrigger className="grow rounded-md border mx-2 min-w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t("table.all")}</SelectItem>
                <SelectItem value="month_salary_unpaid">{t("table.month_salary_unpaid")}</SelectItem>
                <SelectItem value="month_salary_paid">{t("table.month_salary_paid")}</SelectItem>
                <SelectItem value="leave">{t("table.leave")}</SelectItem>
            </SelectContent>
        </Select>
    )
}