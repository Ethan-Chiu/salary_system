import { Table } from "@tanstack/react-table"
import { DataTableViewOptions } from "./data_table_view_options"
import { Input } from "~/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>,
  globalFilter: string,
  filterKey: string
}

export function DataTableToolbar<TData>({
  table, globalFilter, filterKey
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 py-6">
        {/* search bar */}
        <Input
            disabled={globalFilter !== ""} // TODO: fix
            placeholder="Filter setting..."
            value={
                globalFilter === ""
                    ? (table
                            .getColumn(filterKey)
                            ?.getFilterValue() as string) ?? ""
                    : globalFilter
            }
            onChange={(event) => {
                console.log("changed");
                table
                    .getColumn(filterKey)
                    ?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
    </div>
  )
}