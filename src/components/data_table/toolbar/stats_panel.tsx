import { type Table, type Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { number } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

interface StatsPanelProps<TData> {
    table: Table<TData>;
}

export function StatsPanel<TData>({
    table,
}: StatsPanelProps<TData>) {
    const { t } = useTranslation(['common']);
    return (
        <div className="ml-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto w-40 h-8"
                    >
                        <div className="flex items-center">
                            {t("table.stats_panel")}
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[500px] h-[200px] overflow-y-auto">
                    <StatsPanelContent table={table} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function StatsPanelContent<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation(['common']);
    const excludedColumns = ['id', 'emp_no', 'name', 'created_at', 'updated_at'];
    const columns = table.getAllColumns().filter((column) => !excludedColumns.includes(column.id));

    if (columns.length === 0) {
        return <div>{t("table.no_data")}</div>;
    }

    return (
        <ScrollArea>
            <Tabs defaultValue={columns[0]!.id}>
                <TabsList className="w-full flex-row">
                    {columns.map((column) => (
                        <TabsTrigger value={column.id} className="grow">{t(`table.${column.id}`)}</TabsTrigger>
                    ))}
                    {columns.map((column) => (
                        <TabsTrigger value={column.id} className="grow">{t(`table.${column.id}`)}</TabsTrigger>
                    ))}
                </TabsList>
                {columns.map((column) => (
                    <TabsContent value={column.id} className="w-full">
                        <ColumnComponent key={column.id} column={column} />
                    </TabsContent>
                ))}
            </Tabs>
            <ScrollBar orientation="horizontal" hidden={true} />
        </ScrollArea>
    );
}

function ColumnComponent<TData>({ column }: { column: Column<TData, unknown> }) {
    const { t } = useTranslation(['common']);
    const uniqueValues = Array.from(column.getFacetedUniqueValues().entries());
    return (
        <div className="mt-4 w-full">
            <TableRow className="sticky top-0 flex w-full bg-secondary">
                <TableHead key={"value"} align="center" className="text-center grow">{t(`table.value`)}</TableHead>
                <TableHead key={"count"} align="center" className="text-center grow">{t(`table.count`)}</TableHead>
            </TableRow>
            {uniqueValues.map(([key, value]) =>
                <TableRow className="flex w-full">
                    <TableCell key={key} align="center" className="max-w-xs text-center grow">{key}</TableCell>
                    <TableCell key={value} align="center" className="max-w-xs text-center grow">{value}</TableCell>
                </TableRow>
            )}
            {typeof uniqueValues[0]?.[0] === 'number' &&
                <TableRow className="flex w-full">
                    <TableCell key={"total"} align="center" className="max-w-xs text-center grow">{t(`table.total`)}</TableCell>
                    <TableCell key={"sum"} align="center" className="max-w-xs text-center grow">{uniqueValues.reduce((sum, [key, value]) => sum + key * value, 0)}</TableCell>
                </TableRow>
            }
        </div >
    );
}