import { SelectTrigger } from "@radix-ui/react-select";
import { type Table } from "@tanstack/react-table";
import { Select, SelectContent, SelectItem, SelectValue } from "~/components/ui/select";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

function getFilterFunvtionByValue<TData>(table: Table<TData>, value: string) {
    switch (value) {
        case "all":
            return table.getColumn("month_pay")?.setFilterValue("");
        case "month_pay":
            return table.getColumn("month_pay")?.setFilterValue(true);
        case "no_month_pay":
            return table.getColumn("month_pay")?.setFilterValue(false);
        default:
            return table.setGlobalFilter("");
    }
}

export function AdvancedFilter<TData>({
    table,
}: DataTableToolbarProps<TData>) {
    return (
        <Select defaultValue="all" onValueChange={value => getFilterFunvtionByValue(table, value)}>
            <SelectTrigger className="grow rounded-md border ml-2">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="month_pay">month_pay</SelectItem>
                <SelectItem value="no_month_pay">no_month_pay</SelectItem>
            </SelectContent>
        </Select>
    )
}