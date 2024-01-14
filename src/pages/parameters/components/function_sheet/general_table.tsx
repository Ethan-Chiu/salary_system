import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { isDateType } from "~/lib/utils/check_type";
import { Translate } from "~/lib/utils/translation";

export default function GeneralTable({ data }: { data: Record<string, any> }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="whitespace-nowrap text-center">
						{"Key"}
					</TableHead>
					<TableHead className="whitespace-nowrap text-center">
						{"Value"}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Object.keys(data).map((key: string, index: number) => {
					const entry_value = data[key];
					return (
						<TableRow key={index.toString()}>
							<TableCell className="text-center font-medium">
								{Translate(key)}
							</TableCell>
							<TableCell className="text-center font-medium">
								{isDateType(entry_value)
									? entry_value.toISOString().split("T")[0]
									: entry_value}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
