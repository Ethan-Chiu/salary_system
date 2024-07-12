import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";
import { useTranslation } from "react-i18next";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

function getFilterFunvtionByValue<TData>(table: Table<TData>, value: string) {
    switch (value) {
        case "all":
            return table.getColumn("month_salary")?.setFilterValue("");
        case "month_salary":
            return table.getColumn("month_salary")?.setFilterValue(true);
        case "no_month_salary":
            return table.getColumn("month_salary")?.setFilterValue(false);
        default:
            return table.setGlobalFilter("");
    }
}

export function AdvancedFilter<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    const { t } = useTranslation(['common']);
    return (
        <Select defaultValue="all" onValueChange={value => getFilterFunvtionByValue(table, value)}>
            <SelectTrigger className="grow rounded-md border ml-2">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">{t("table.all")}</SelectItem>
                <SelectItem value="month_salary">{t("table.month_salary")}</SelectItem>
                <SelectItem value="no_month_salary">{t("table.no_month_salary")}</SelectItem>
            </SelectContent>
        </Select>
    )
}