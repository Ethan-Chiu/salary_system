// // ExcelViewer.tsx
// import React, { useState, useEffect } from "react";
// import { Label } from "~/components/ui/label";
// import { Button } from "~/components/ui/button";
// import ExcelJS from "exceljs";
// import {
// 	Select,
// 	SelectContent,
// 	SelectGroup,
// 	SelectItem,
// 	SelectLabel,
// 	SelectTrigger,
// 	SelectValue,
// } from "~/components/ui/select";
// import { Baseline, PaintBucket } from "lucide-react";

// import { useTranslation } from "react-i18next";

// interface ExcelSheet {
// 	sheetName: string;
// 	data: string[][];
// }

// interface ExcelViewerProps {
// 	sheets: ExcelSheet[];
// }

// const handleExportExcel = async (datas: any, filename: string) => {
// 	const workbook = new ExcelJS.Workbook();

// 	if (datas) {
// 		datas.map((sheetdata: any, index: number) => {
// 			let name = sheetdata.sheetName;
// 			const worksheet = workbook.addWorksheet(
// 				name === "" ? "blank" : name
// 			);
// 			try {
// 				sheetdata.data.map((row: any, i: number) => {
// 					worksheet.addRow(row);
// 				});
// 			} catch {}
// 		});
// 	}

// 	// Save the workbook to a file
// 	const buffer = await workbook.xlsx.writeBuffer();
// 	const blob = new Blob([buffer], {
// 		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// 	});
// 	const url = URL.createObjectURL(blob);
// 	const a = document.createElement("a");
// 	a.href = url;
// 	a.download = filename;
// 	a.click();
// 	URL.revokeObjectURL(url);
// };

// const ExcelViewer: React.FC<ExcelViewerProps> = ({ sheets }) => {
// 	const [selectedSheetName, setSelectedSheetName] = useState<string>("");
// 	const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
// 	const findSheetIndexByName = (sheetName: string): number => {
// 		const index = sheets.findIndex(
// 			(sheet) => sheet.sheetName === sheetName
// 		);
// 		return index;
// 	};
// 	const [excelData, setExcelData] = useState<string[][]>([]);
// 	const [colors, setColors] = useState<string[][][]>([[[]]]);

// 	const [mode, setMode] = useState<string>("view");
// 	const [selectedCell, setSelectedCell] = useState<{
// 		rowIndex: number;
// 		colIndex: number;
// 	}>({ rowIndex: -1, colIndex: -1 });

// 	const { t } = useTranslation(['nav', 'common']);

// 	interface ColorBlock {
// 		textColor: string;
// 		backgroundColor: string;
// 	}
// 	const [blockProps, setBlockProps] = useState<ColorBlock[][][]>();

// 	useEffect(() => {
// 		// Set the initial data based on the selected sheet index
// 		if (sheets.length > 0) {
// 			setExcelData(sheets[selectedSheetIndex]!.data);
// 			setSelectedSheetName(sheets[0]?.sheetName ?? "");
// 		}

// 		let defaultBlockProps: ColorBlock[][][] = [];
// 		sheets.map((sheet: ExcelSheet, sheetIndex: number) => {
// 			defaultBlockProps.push([]);
// 			sheet.data.map((row: string[], rowIndex: number) => {
// 				defaultBlockProps[sheetIndex]!.push([]);
// 				row.map((cell: string, colIndex: number) => {
// 					defaultBlockProps[sheetIndex]![rowIndex]?.push({
// 						textColor: "#000000",
// 						backgroundColor: "#ffffff",
// 					});
// 				});
// 			});
// 		});
// 		// console.log(defaultBlockProps);
// 		setBlockProps(defaultBlockProps);
// 	}, []);

// 	function setBlockColor(
// 		element: "text" | "background",
// 		sheetIndex: number,
// 		rowIndex: number,
// 		colIndex: number,
// 		newColor: string
// 	) {
// 		// if (sheetIndex < 0 || rowIndex < 0 || colIndex < 0)	return;
// 		let newBlockProps: ColorBlock[][][] = [];
// 		blockProps?.map((sheet: ColorBlock[][], si: number) => {
// 			newBlockProps.push([]);
// 			sheet.map((row: ColorBlock[], ri: number) => {
// 				newBlockProps[si]!.push([]);
// 				row.map((cell: ColorBlock, ci: number) => {
// 					if (si == sheetIndex && ri == rowIndex && ci == colIndex) {
// 						if (element === "text") {
// 							let newCell: ColorBlock = {
// 								textColor: newColor,
// 								backgroundColor: cell.backgroundColor,
// 							};
// 							newBlockProps[si]![ri]?.push(cell);
// 						} else if (element === "background") {
// 							let newCell: ColorBlock = {
// 								textColor: cell.textColor,
// 								backgroundColor: newColor,
// 							};
// 							newBlockProps[si]![ri]?.push(cell);
// 						}
// 					} else {
// 						newBlockProps[si]![ri]?.push(cell);
// 					}
// 				});
// 			});
// 		});
// 	}

// 	const handleSheetChange = (index: number) => {
// 		setSelectedSheetIndex(index);
// 	};

// 	function ChangeTextColorIcon() {
// 		return <Baseline />;
// 	}

// 	function ChangeBackgroundColorIcon() {
// 		return <PaintBucket />;
// 	}

// 	return (
// 		<>
// 			<Button onClick={() => setBlockColor("text", 0, 1, 1, "#aa0000")} />
// 			<Button onClick={() => console.log(blockProps)} />
// 			<div className="full-w mb-4 grid grid-cols-4">
// 				<div>
// 					{/* Sheet selection dropdown */}
// 					<Select
// 						value={selectedSheetName}
// 						onValueChange={(value) => {
// 							setSelectedCell({ rowIndex: -1, colIndex: -1 });
// 							setSelectedSheetName(value);
// 							setSelectedSheetIndex(findSheetIndexByName(value));
// 						}}
// 					>
// 						<SelectTrigger className="w-[180px]">
// 							<SelectValue placeholder="Select a sheet" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							<SelectGroup>
// 								<SelectLabel>Sheets</SelectLabel>
// 								{sheets.map((sheetdata: any) => {
// 									return (
// 										<SelectItem value={sheetdata.sheetName}>
// 											{sheetdata.sheetName}
// 										</SelectItem>
// 									);
// 								})}
// 							</SelectGroup>
// 						</SelectContent>
// 					</Select>
// 				</div>
// 				<div className="col-start-4 flex items-center justify-end">
// 					{mode == "edit" && (
// 						<>
// 							<div className="mr-2">
// 								<ChangeBackgroundColorIcon />
// 							</div>
// 							<div className="mr-2">
// 								<ChangeTextColorIcon />
// 							</div>
// 						</>
// 					)}
// 					<Button
// 						className="mr-2"
// 						variant={"outline"}
// 						onClick={() => {
// 							if (mode === "view") {
// 								setMode("edit");
// 							} else if (mode === "edit") {
// 								setMode("view");
// 								setSelectedCell({
// 									rowIndex: -1,
// 									colIndex: -1,
// 								});
// 							}
// 						}}
// 					>
// 						{mode === "view" ? "Edit" : "Save"}
// 					</Button>
// 					<Button
// 						variant={"outline"}
// 						onClick={() => {
// 							handleExportExcel(sheets, "test.xlsx");
// 						}}
// 					>
// 						Download
// 					</Button>
// 				</div>
// 			</div>
// 			<div className="excel-viewer-container w-full overflow-x-auto  rounded border bg-white p-4 shadow-md">
// 				{excelData.length > 0 && (
// 					<div>
// 						{/* Render Excel data as HTML */}
// 						<table
// 							style={{
// 								borderCollapse: "collapse",
// 								width: "100%",
// 								marginTop: "10px",
// 								whiteSpace: "nowrap", // Prevent text wrapping
// 							}}
// 						>
// 							<thead>
// 								<tr>
// 									{excelData[0]!.map(
// 										(header, headerIndex) => (
// 											<th
// 												key={headerIndex}
// 												style={{
// 													backgroundColor: "#f2f2f2",
// 													border: "1.2px solid #ddd",
// 													padding: "8px",
// 													textAlign: "center",
// 												}}
// 											>
// 												{header}
// 											</th>
// 										)
// 									)}
// 								</tr>
// 							</thead>
// 							<tbody>
// 								{excelData
// 									.slice(1)
// 									.map((row, rowIndex: number) => (
// 										<tr key={rowIndex}>
// 											{row.map(
// 												(cell, colIndex: number) => {
// 													let border_style =
// 														selectedCell.rowIndex ===
// 															rowIndex &&
// 														selectedCell.colIndex ===
// 															colIndex
// 															? "1.5px solid #0000ff"
// 															: "1.3px solid #dddddd";
// 													// console.log(excelData);
// 													// console.log(
// 													// 	blockProps![
// 													// 		selectedSheetIndex
// 													// 	]![rowIndex]
// 													// );
// 													// console.log(
// 													// 	"%d, %d, %d",
// 													// 	selectedSheetIndex,
// 													// 	rowIndex,
// 													// 	colIndex
// 													// );
// 													// let backgroundColor = blockProps![selectedSheetIndex]![rowIndex]![colIndex]!.backgroundColor;
// 													let textColor =
// 														blockProps![
// 															selectedSheetIndex
// 														]![rowIndex]![colIndex]!
// 															.textColor;
// 													let backgroundColor =
// 														"#ffffff";
// 													// let textColor = "#ffffff";
// 													return (
// 														<td
// 															key={colIndex}
// 															style={{
// 																border: border_style,
// 																padding: "8px",
// 																textAlign:
// 																	"center",
// 																backgroundColor:
// 																	backgroundColor,
// 																color: textColor,
// 															}}
// 															onClick={() => {
// 																if (
// 																	mode ==
// 																	"edit"
// 																) {
// 																	setSelectedCell(
// 																		{
// 																			rowIndex:
// 																				rowIndex,
// 																			colIndex:
// 																				colIndex,
// 																		}
// 																	);
// 																}
// 															}}
// 														>
// 															{cell}
// 														</td>
// 													);
// 												}
// 											)}
// 										</tr>
// 									))}
// 							</tbody>
// 						</table>
// 					</div>
// 				)}
// 			</div>
// 		</>
// 	);
// };

// export default ExcelViewer;
