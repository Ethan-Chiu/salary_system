import React, { useEffect, useState, useContext } from "react";
import ExcelJS from "exceljs";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";
import { parameterToolbarFunctionsContext } from "../function_sheet/parameter_functions_context";
import dataTableContext from "../context/data_table_context";
import { getExcelData } from "./utils";

export function ExcelDownload({ table_name }: { table_name: string }) {
	const { t } = useTranslation();

	const [filename, setFilename] = useState("excel.xlsx");
	useEffect(() => {
		setFilename(`${t(`table_name.${table_name}`)}.xlsx`);
	}, [table_name]);

	const { selectedTable } = useContext(dataTableContext);


	// MARK: Excel Download Function
	const handleExportExcel = async (
		datas: any[][],
		filename: string,
		Translate: (key: string) => string
	) => {
		const workbook = new ExcelJS.Workbook();

		function getCellName(rowIndex: number, colIndex: number): string {
			const columnName = getColumnLetter(colIndex);
			return columnName + (rowIndex + 1);
		}

		function getColumnLetter(colIndex: number): string {
			let columnName = "";
			while (colIndex >= 0) {
				const remainder = colIndex % 26;
				columnName = String.fromCharCode(65 + remainder) + columnName;
				colIndex = Math.floor(colIndex / 26) - 1;
				if (colIndex < 0) {
					break;
				}
			}
			return columnName;
		}

		if (datas) {
			let name = table_name;
			const worksheet = workbook.addWorksheet(
				name === "" ? "blank" : name
			);
			try {
				if (!datas) return;
				datas.map((row: any[], i: number) => {
					if (i === 0) {
						worksheet.addRow(
							row.map((header: string) =>
								Translate(`table.${header}`)
							)
						);
					} else {
						worksheet.addRow(row);
					}

					worksheet.columns = (datas[0] ?? []).map(() => ({
						width: 25, // Adjust this value as needed
					}));
				});
			} catch {}

			if (datas)
				datas.forEach((row: any[], ri: number) => {
					row.forEach((cellProps: string, ci: number) => {
						const cellName = getCellName(ri, ci);
						const cell = worksheet.getCell(cellName);

						cell.border = {
							top: { style: "thin" },
							left: { style: "thin" },
							bottom: { style: "thin" },
							right: { style: "thin" },
						};
					});
				});
		}

		// Save the workbook to a file
		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${filename}.xlsx`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						{t("table.filename")}
					</Label>
					<Input
						id="filename"
						value={filename}
						onChange={(e) => {
							setFilename(e.target.value);
						}}
						className="col-span-3"
					/>
				</div>
			</div>
			<DialogFooter>
				<Button type="submit" onClick={() => handleExportExcel(
					getExcelData(selectedTable?.table.getFilteredRowModel().rows.map((r) => r.original)!, ["functions"])
				, filename, t)}>{t("download")}</Button>
			</DialogFooter>
		</>
	);
}
