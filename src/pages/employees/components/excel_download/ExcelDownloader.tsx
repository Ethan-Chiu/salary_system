import React, { useEffect, useState, useContext } from "react";
import ExcelJS from "exceljs";
import { DialogFooter } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

import { useTranslation } from "react-i18next";

import { getExcelData } from "./utils";

import dataTableContext from "../context/data_table_context";
import periodContext from "~/components/context/period_context";

export function ExcelDownload({ 
	table_name,
	closeSheet
}: { 
	table_name: string,
	closeSheet: () => void
}) {

	const { selectedTable, selectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);
	
	const period_name = selectedPeriod?.period_name ?? "ERROR";

	function getTableName() {
		if (table_name === "TableEmployeePayment") 	return "employeePayment";
		if (table_name === "TableEmployeeTrust")	return "employeeTrust";
		

		return table_name;
	}

	function getColumns() {
		if (selectedTable?.table.options.meta?.original_columns)	return selectedTable?.table.options.meta?.original_columns;
		return selectedTable?.table.getAllColumns().map(c => c.id).filter(c => !["id", "functions"].includes(c));
	}

	const { t } = useTranslation();

	const [filename, setFilename] = useState("excel.xlsx");
	useEffect(() => {
		// [table_name]_[bonus_type]_[period_name].xlsx
		setFilename(`${t(`table_name.${getTableName()}`)}.xlsx`);
	}, [table_name]);

	function transposeData(data: any[][]): any[][] {
		const tranposed_data = (data[0] ?? []).map((_, colIndex) => data.map(row => row[colIndex]));
		return tranposed_data.map((row) => row.slice(1));
	}

	// MARK: Excel Download Function
	const handleExportExcel = async (
		datas: any[][],
		filename: string,
	) => {

		
		function getMappedIndex(key: string) {
			let index = -1;
			(datas ?? [[]])[0]!.forEach((k: string, i: number) => {
				if (k == key) {
					index = i;
				}
			})
			return index;
		}


		const workbook = new ExcelJS.Workbook();

		const shouldTranspose = [
			"TableBonusAll",
		].includes(table_name);



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

			if (shouldTranspose) datas = transposeData(datas);

			let name = t(`table_name.${getTableName()}`);
			const worksheet = workbook.addWorksheet(
				name === "" ? "blank" : name
			);
			try {
				if (datas.length == 0) {
					const translated_headers = getColumns()?.map((header: string) => t(`table.${header}`));
					if (shouldTranspose) {
						worksheet.addRow(translated_headers);
					}
					else {
						worksheet.addRow(translated_headers);
					}

					// Increase cell width
					worksheet.columns = (translated_headers ?? []).map(() => ({
						width: 25, // Adjust this value as needed
					}));
				}
				else {
					worksheet.addRow(getColumns()?.map((header: string) => t(`table.${header}`)));
					datas.slice(1).map((row: any[], i: number) => {
						worksheet.addRow(
							getColumns()?.map((header: string, ci: number) => {
								return row[getMappedIndex(header)];
							}
						))
						// if (i === 0) {
						// 	worksheet.addRow(
						// 		row.map((header: string) =>
						// 			(shouldTranspose) ? header : t(`table.${header}`)
						// 		)
						// 	);
						// } else {
						// 	worksheet.addRow(row);
						// }

						worksheet.columns = (datas[0] ?? []).map(() => ({
							width: 25, // Adjust this value as needed
						}));
					});
				}
			} catch { }
			/* MARK: add cell props
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
			*/
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
		<div className="m-2">
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
				<Button type="submit" onClick={() => 
					// console.log(selectedTable?.table.getFilteredRowModel().rows.map((r) => r.original))
					// console.log(selectedTable?.table.options.meta?.original_columns)
					handleExportExcel(
						getExcelData(selectedTable?.table.getFilteredRowModel().rows.map((r) => r.original)!, ["id", "functions"]),
						filename
					)
				}>
					{t("button.excel_download")}
				</Button>
			</DialogFooter>
		</div>
	);
}
