import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { ScrollArea } from "~/components/ui/scroll-area";

interface StatsPanelProps<TData> {
    table: Table<TData>;
}

export function StatsPanel<TData>({
    table,
}: StatsPanelProps<TData>) {
    const { t } = useTranslation(['common']);

    return (
        <div className="ml-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto w-40 h-8"
                    >
                        <div className="flex items-center">
                            {t("table.stats_panel")}
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
                    <ScrollArea>
                        <DropdownMenuLabel>{t("others.visible_columns")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .map((column) => {
                                return (
                                    <div>{t(`table.${column.id}`)}</div>
                                );
                            })}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
