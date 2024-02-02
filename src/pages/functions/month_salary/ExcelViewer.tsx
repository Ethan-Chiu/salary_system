// ExcelViewer.tsx
import React, { useState, useEffect } from "react";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
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

interface ExcelSheet {
	sheetName: string;
	data: string[][];
}

interface ExcelViewerProps {
	sheets: ExcelSheet[];
}

const handleExportExcel = async (datas: any, filename: string) => {
	const workbook = new ExcelJS.Workbook();

	if (datas) {
		datas.map((sheetdata: any, index: number) => {
			let name = sheetdata.sheetName;
			const worksheet = workbook.addWorksheet(
				name === "" ? "blank" : name
			);
			try {
				sheetdata.data.map((row: any, i: number) => {
					worksheet.addRow(row);
				});
			} catch {}
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
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
};

const ExcelViewer: React.FC<ExcelViewerProps> = ({ sheets }) => {
	const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
	const findSheetIndexByName = (sheetName: string): number => {
		const index = sheets.findIndex(
			(sheet) => sheet.sheetName === sheetName
		);
		return index;
	};
	const [excelData, setExcelData] = useState<string[][]>([]);

	useEffect(() => {
		// Set the initial data based on the selected sheet index
		if (sheets.length > 0) {
			setExcelData(sheets[selectedSheetIndex]!.data);
		}
	}, [sheets, selectedSheetIndex]);

	const handleSheetChange = (index: number) => {
		setSelectedSheetIndex(index);
	};

	return (
		<>
			<div className="mb-4 grid grid-cols-4">
				<div>
					{/* Sheet selection dropdown */}
					<Select
						onValueChange={(value) => {
							setSelectedSheetIndex(findSheetIndexByName(value));
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a sheet" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Sheets</SelectLabel>
								{sheets.map((sheetdata: any) => {
									return (
										<SelectItem value={sheetdata.sheetName}>
											{sheetdata.sheetName}
										</SelectItem>
									);
								})}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="col-start-4 text-right">
					<Button
						variant={"outline"}
						onClick={() => {
							handleExportExcel(sheets, "test.xlsx");
						}}
					>
						Download
					</Button>
				</div>
			</div>
			<div className="excel-viewer-container w-full overflow-x-auto  rounded border bg-white p-4 shadow-md">
				{excelData.length > 0 && (
					<div>
						{/* Render Excel data as HTML */}
						<table
							style={{
								borderCollapse: "collapse",
								width: "100%",
								marginTop: "10px",
								whiteSpace: "nowrap", // Prevent text wrapping
							}}
						>
							<thead>
								<tr>
									{excelData[0]!.map(
										(header, headerIndex) => (
											<th
												key={headerIndex}
												style={{
													backgroundColor: "#f2f2f2",
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{header}
											</th>
										)
									)}
								</tr>
							</thead>
							<tbody>
								{excelData.slice(1).map((row, rowIndex) => (
									<tr key={rowIndex}>
										{row.map((cell, cellIndex) => (
											<td
												key={cellIndex}
												style={{
													border: "1px solid #ddd",
													padding: "8px",
													textAlign: "center",
												}}
											>
												{cell}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
};

export default ExcelViewer;
