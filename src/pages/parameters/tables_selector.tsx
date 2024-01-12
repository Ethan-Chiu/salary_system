import React, { useContext, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { getTableName } from "./components/context/data_table_enum";
import {
	ShowTableEnum,
	ShowTableEnumValues,
	TableComponent,
	getTableComponent,
} from ".";
import dataTableContext from "./components/context/data_table_context";
import { cn } from "~/lib/utils";

export default function TablesSelector() {
	const [selectedTag, setSelectedTag] = useState<ShowTableEnum>(
		ShowTableEnumValues[0]
	);

	const { setSelectedTable } = useContext(dataTableContext);

	const tableComponentMap: Record<ShowTableEnum, TableComponent> =
		ShowTableEnumValues.reduce((map, table) => {
			map[table] = getTableComponent(table);
			return map;
		}, {} as Record<ShowTableEnum, TableComponent>);

	return (
		<div>
			<div className="flex h-[48px] items-center justify-center text-lg">
				<div>Tables</div>
			</div>
			<Separator />
			<ScrollArea className="h-full">
				{ShowTableEnumValues.map((table) => {
					const tableComponent = tableComponentMap[table];
					
					return (
						<div
							key={table}
							className={cn(
								"m-2 flex items-center rounded-md border p-1 hover:bg-muted",
								table === selectedTag && "bg-muted"
							)}
							onClick={() => {
								setSelectedTag(table);
								setSelectedTable(table);
							}}
						>
							<tableComponent.icon
								size={18}
								className="ml-1 mr-2 flex-shrink-0 cursor-pointer"
							/>
							<div className="m-1 line-clamp-1 break-all">
								{getTableName(table)}
							</div>
						</div>
					);
				})}
			</ScrollArea>
		</div>
	);
}
