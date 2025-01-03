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
import { useTranslation } from "react-i18next";
import { formatDate } from "~/lib/utils/format_date";

export default function GeneralTable({ data }: { data: Record<string, any> }) {
	const { t } = useTranslation(["common"]);
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="whitespace-nowrap text-center">
						{t("table.key")}
					</TableHead>
					<TableHead className="whitespace-nowrap text-center">
						{t("table.value")}
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{Object.keys(data).map((key: string, index: number) => {
					const entry_value = data[key];
					return (
						<TableRow key={index.toString()}>
							<TableCell className="text-center font-medium">
								{t(`table.${key}`)}
							</TableCell>
							<TableCell className="text-center font-medium">
								{isDateType(entry_value)
									? formatDate("day", entry_value)
									: entry_value}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

