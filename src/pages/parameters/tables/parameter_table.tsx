import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import type {
	ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import {
	isString,
	isNumber,
	isDate,
} from "~/pages/develop_parameters/utils/checkType";
import { Translate } from "~/pages/develop_parameters/utils/translation";
import { DataTable } from "../components/data_table";

export type SettingItem = {
	name: string;
	value: number | string | Date;
	setting?: (number | string)[];
};

export function ParameterTable({
	table_name,
	defaultData,
	index,
	globalFilter,
}: any) {
	const [data, setData] = useState<SettingItem[]>(defaultData);
	const [showDialog, setShowDialog] = useState(false);

	const filter_key = "name";

	const columns: ColumnDef<SettingItem>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() =>
							column.toggleSorting(column.getIsSorted() === "asc")
						}
					>
						Parameter
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="pl-4 lowercase">
					{Translate(row.getValue("name"))}
				</div>
			),
		},
		{
			accessorKey: "value",
			header: () => <div className="text-center">Value</div>,
			cell: ({ row }) => {
				let value = row.getValue("value");
				var formatted = "";
				if (isNumber(value))
					formatted = parseFloat(row.getValue("value")).toString();
				else if (isString(value)) formatted = row.getValue("value");
				else if (isDate(value)) {
					if (value) {
						formatted =
							(value as Date).toISOString().split("T")[0] ?? "";
					} else formatted = "";
				}
				return (
					<div className="text-center font-medium">{formatted}</div>
				);
			},
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const setting = row.original;
				return <></>;
			},
		},
	];

	// useMemo(() => {
	// 	table.getColumn(filter_key)?.setFilterValue(globalFilter);
	// }, [globalFilter]);

	return (
		<>
			<AccordionItem value={"item-" + index.toString()}>
				<AccordionTrigger>{table_name}</AccordionTrigger>
				<AccordionContent>
					<DataTable columns={columns} data={[]}/>
				</AccordionContent>
			</AccordionItem>
		</>
	);

}
