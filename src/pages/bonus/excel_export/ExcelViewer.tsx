import React, { useEffect, useState } from "react";
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
import { Baseline, PaintBucket } from "lucide-react";
import { ColorPickerWrapper } from "./ColorPickerWrapper";

import { useTranslation } from "react-i18next";

const DEFAULT_TEXT_COLOR = "#000000";
const DEFAULT_BACKGROUND_COLOR = "#ffffff";
const DEFAULT_HEADER_BACKGROUND_COLOR = "#909090";
const formatColor = (colorCode: string, colorMode: "text" | "background") => {
	return colorMode == "text" ? `text-[${colorCode}]` : `bg-[${colorCode}]`;
};

interface ExcelSheet {
	sheetName: string;
	data: string[][];
}

interface ExcelSheetWithColor {
	sheetName: string;
	data: Block[][];
}

interface ExcelViewerProps {
	original_sheets: ExcelSheet[];
	selectedSheetIndex: number;
	setSelectedSheetIndex: (index: number) => void;
	filter_component: JSX.Element;
}


const standard_sheet_name = "Standard"
const Standard: ExcelSheetWithColor = {
	sheetName: standard_sheet_name,
	data: [
		[
			{ content: "考績分佈比例", textColor: "#000000", backgroundColor: "#ccffcc" },
			{ content: "績效獎金月倍數", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "974考績等級", textColor: "#ff0000", backgroundColor: "#ffffff" },
			{ content: "個人績效獎金月倍數", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "姓名", textColor: "#0000ff", backgroundColor: "#ffffff" },
		],
		[
			{ content: "10%", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "3", textColor: "#ff0000", backgroundColor: "#ffffff" },
			{ content: "AE", textColor: "#000000", backgroundColor: "#ffff00" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "9E", textColor: "#000000", backgroundColor: "#ffff00" },
			{ content: "Average E", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "30%", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "2", textColor: "#ff0000", backgroundColor: "#ffffff" },
			{ content: "8A", textColor: "#000000", backgroundColor: "#00ffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "7A", textColor: "#000000", backgroundColor: "#00ffff" },
			{ content: "Average A", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "6A", textColor: "#000000", backgroundColor: "#00ffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "55%", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "1.2", textColor: "#ff0000", backgroundColor: "#ffffff" },
			{ content: "5B", textColor: "#000000", backgroundColor: "#66ff33" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "4B", textColor: "#000000", backgroundColor: "#66ff33" },
			{ content: "Average B", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "3B", textColor: "#000000", backgroundColor: "#66ff33" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "2B", textColor: "#000000", backgroundColor: "#66ff33" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
		[
			{ content: "5%", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "0", textColor: "#ff0000", backgroundColor: "#ffffff" },
			{ content: "1C", textColor: "#000000", backgroundColor: "#ff0000" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
			{ content: "", textColor: "#000000", backgroundColor: "#ffffff" },
		],
	],
}


interface Block {
	content: string;
	textColor: string;
	backgroundColor: string;
}

const handleExportExcel = async (
	datas: ExcelSheetWithColor[],
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
		datas.concat([Standard]).map((sheetdata: ExcelSheetWithColor, si: number) => {
			let name = sheetdata.sheetName;
			const worksheet = workbook.addWorksheet(
				name === "" ? "blank" : name
			);
			try {
				sheetdata.data.map((row: Block[], i: number) => {
					if (i === 0) {
						worksheet.addRow(
							row.map((cell: Block) => {
								if (name !== standard_sheet_name)
									return Translate(`table.${cell.content}`)
								else
									return cell.content
							}
							)
						);
					} else {
						worksheet.addRow(
							row.map((cell: Block) => cell.content)
						);
					}
				});
			} catch {}

			sheetdata.data.forEach((row: Block[], ri: number) => {
				row.forEach((cellProps: Block, ci: number) => {
					const cellName = getCellName(ri, ci);
					const cell = worksheet.getCell(cellName);

					// Set text color
					if (cellProps.textColor) {
						const textColor = cellProps.textColor.substring(1); // Remove '#' from color code
						cell.font = { color: { argb: textColor } };
					}

					// Set background color
					if (cellProps.backgroundColor) {
						const bgColor = cellProps.backgroundColor.substring(1); // Remove '#' from color code
						cell.fill = {
							type: "pattern",
							pattern: "solid",
							fgColor: { argb: bgColor },
						};
					}

					cell.border = {
						top: { style: "thin" },
						left: { style: "thin" },
						bottom: { style: "thin" },
						right: { style: "thin" },
					};

				});
			});

			worksheet.columns.forEach(column => {
				column.width = 20;	
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
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
};

const ExcelViewer: React.FC<ExcelViewerProps> = ({
	original_sheets,
	selectedSheetIndex,
	setSelectedSheetIndex,
	filter_component,
}) => {
	const [mode, setMode] = useState("view");
	const [selectedCell, setSelectedCell] = useState<{
		rowIndex: number;
		colIndex: number;
	}>({ rowIndex: -1, colIndex: -1 });

	const [sheets, setSheets] = useState<ExcelSheetWithColor[]>([]);
	const [lastValidSheets, setLastValidSheets] = useState<
		ExcelSheetWithColor[]
	>([]);

	const { t } = useTranslation(["common"]);

	useEffect(() => {
		let tmpSheets: ExcelSheetWithColor[] = [];
		original_sheets.map((s: ExcelSheet) => {
			let tmpSheetName = s.sheetName;
			let tmpSheetData: Block[][] = s.data.map(
				(row: string[], row_index: number) => {
					return row.map((cell: string, col_index: number) => {
						if (row_index === 0) {
							return {
								content: cell,
								textColor: DEFAULT_TEXT_COLOR,
								backgroundColor:
									DEFAULT_HEADER_BACKGROUND_COLOR,
							};
						} else
							return {
								content: cell,
								textColor: DEFAULT_TEXT_COLOR,
								backgroundColor: DEFAULT_BACKGROUND_COLOR,
							};
					});
				}
			);
			tmpSheets.push({
				sheetName: tmpSheetName,
				data: tmpSheetData,
			});
		});
		setSheets(tmpSheets);
	}, [original_sheets]);

	const setSelectedIndexWithName = (queryName: string) => {
		let selectedIndex = -1;
		sheets.map((sheet: ExcelSheetWithColor, index: number) => {
			if (sheet.sheetName === queryName) selectedIndex = index;
		});
		setSelectedSheetIndex(selectedIndex);
	};

	function SelectSheetComponent() {
		// change selectedSheetIndex to control the shown sheet
		const selectedSheet = sheets[selectedSheetIndex]!;
		return (
			<>
				{selectedSheet && (
					<Select
						value={selectedSheet.sheetName}
						onValueChange={(value) => {
							setSelectedIndexWithName(value);
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a sheet" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Sheets</SelectLabel>
								{sheets.map(
									(sheetdata: ExcelSheetWithColor) => {
										return (
											<SelectItem
												value={sheetdata.sheetName}
											>
												{sheetdata.sheetName}
											</SelectItem>
										);
									}
								)}
							</SelectGroup>
						</SelectContent>
					</Select>
				)}
			</>
		);
	}

	function getTableContent(
		query: "content" | "textColor" | "backgroundColor",
		sheetIndex: number,
		rowIndex: number,
		colIndex: number
	) {
		if (!sheetIndex && !rowIndex && !colIndex) {
			sheetIndex = selectedSheetIndex;
			rowIndex = selectedCell.rowIndex;
			colIndex = selectedCell.colIndex;
		} else if (!sheetIndex || !rowIndex || !colIndex) return "";

		if (sheetIndex < 0 || rowIndex < 0 || colIndex < 0) return "";

		let selectedBlock: Block;
		sheets.map((sheet: ExcelSheetWithColor, si: number) => {
			if (si === sheetIndex) {
				sheet.data.map((row: Block[], ri: number) => {
					if (ri === rowIndex) {
						row.map((cell: Block, ci: number) => {
							if (ci === colIndex) {
								selectedBlock = cell;
							}
						});
					}
				});
			}
		});

		const toReturn =
			query === "content"
				? selectedBlock!.content
				: query === "textColor"
				? selectedBlock!.textColor
				: selectedBlock!.backgroundColor;

		console.log(
			"selected Block: ",
			selectedBlock!.content,
			selectedBlock!.textColor,
			selectedBlock!.backgroundColor
		);

		return toReturn;
	}

	function changeSheets(
		sheetIndex: number,
		rowIndex: number,
		colIndex: number,
		key: "content" | "textColor" | "backgroundColor",
		newValue: string
	) {
		let tmpSheets: ExcelSheetWithColor[] = [];
		sheets.map((s: ExcelSheetWithColor, si: number) => {
			let tmpSheetName = s.sheetName;
			let tmpSheetData: Block[][] = s.data.map(
				(row: Block[], ri: number) => {
					return row.map((cell: Block, ci: number) => {
						if (
							si === sheetIndex &&
							ri === rowIndex &&
							ci === colIndex
						)
							return {
								content:
									key === "content" ? newValue : cell.content,
								textColor:
									key === "textColor"
										? newValue
										: cell.textColor,
								backgroundColor:
									key === "backgroundColor"
										? newValue
										: cell.backgroundColor,
							};
						else return cell;
					});
				}
			);
			tmpSheets.push({
				sheetName: tmpSheetName,
				data: tmpSheetData,
			});
		});
		setSheets(tmpSheets);
	}

	function SheetTable() {
		const selectedSheet = sheets[selectedSheetIndex]!;
		return (
			<>
				{selectedSheet && (
					<div className="flex grow h-full w-full flex-col rounded border bg-white p-4 shadow-md ">
						{/* The container for the table */}
						<div className="flex grow overflow-auto justify-center">
							<table className="flex-col grow items-center justify-center"> {/* table-auto border-collapse border border-zinc-950*/}
								<thead>
									<tr>
										{selectedSheet.data[0]!.map(
											(cell, index) => (
												<th
													key={index}
													className={`truncate border border-zinc-950 px-4 py-2 leading-6`}
													style={{
														backgroundColor:
															cell.backgroundColor,
													}}
												>
													<div
														style={{
															color: cell.textColor,
														}}
													>
														{t(
															`table.${cell.content}`
														)}
													</div>
												</th>
											)
										)}
									</tr>
								</thead>
								<tbody>
									{selectedSheet.data
										.slice(1)
										.map((row, rowIndex) => (
											<tr key={rowIndex}>
												{row.map((cell, cellIndex) => (
													<td
														key={cellIndex}
														className={`relative truncate px-4 py-2 leading-6 ${formatColor(
															cell.textColor,
															"text"
														)} ${formatColor(
															cell.backgroundColor,
															"background"
														)}`}
														onClick={() => {
															setSelectedCell({
																rowIndex:
																	rowIndex +
																	1,
																colIndex:
																	cellIndex,
															});
														}}
														style={{
															color: cell.textColor,
															backgroundColor:
																cell.backgroundColor,
														}}
													>
														<div
															className={`absolute inset-0 border ${
																selectedCell.rowIndex -
																	1 ===
																	rowIndex &&
																selectedCell.colIndex ===
																	cellIndex &&
																mode === "edit"
																	? "border-2 border-blue-600"
																	: "border-gray-400"
															}`}
														></div>
														<div className="relative z-10">
															{cell.content}
														</div>
													</td>
												))}
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</>
		);
	}

	function BgColorControlComponent() {
		const [openSignal, setOpenSignal] = useState(false);
		return (
			<>
				<Popover open={openSignal} onOpenChange={setOpenSignal}>
					<PopoverTrigger asChild>
						<Button variant={"ghost"}>
							<PaintBucket className="hover:cursor-pointer" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<ColorPickerWrapper
							initialColor={
								sheets[selectedSheetIndex]!.data.findLast(
									(rows, r_idx) =>
										r_idx === selectedCell.rowIndex
								)?.findLast(
									(cols, c_idx) =>
										c_idx === selectedCell.colIndex
								)?.backgroundColor ?? "#FFFFFF"
							}
							setFinalColor={(newColor: string) => {
								changeSheets(
									selectedSheetIndex,
									selectedCell.rowIndex,
									selectedCell.colIndex,
									"backgroundColor",
									newColor
								);
								setOpenSignal(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	}

	function TextColorControlComponent() {
		const [openSignal, setOpenSignal] = useState(false);
		return (
			<>
				<Popover open={openSignal} onOpenChange={setOpenSignal}>
					<PopoverTrigger asChild>
						<Button variant={"ghost"}>
							<Baseline className="hover:cursor-pointer" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<ColorPickerWrapper
							initialColor={
								sheets[selectedSheetIndex]!.data.findLast(
									(rows, r_idx) =>
										r_idx === selectedCell.rowIndex
								)?.findLast(
									(cols, c_idx) =>
										c_idx === selectedCell.colIndex
								)?.textColor ?? "#FFFFFF"
							}
							setFinalColor={(newColor: string) => {
								changeSheets(
									selectedSheetIndex,
									selectedCell.rowIndex,
									selectedCell.colIndex,
									"textColor",
									newColor
								);
								setOpenSignal(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</>
		);
	}

	function ColorControlComponent() {
		return (
			<>
				{mode == "edit" && (
					<>
						<div className="">
							<BgColorControlComponent />
						</div>
						<div className="mr-2">
							<TextColorControlComponent />
						</div>
					</>
				)}
			</>
		);
	}

	function EditButton() {
		return (
			<>
				<Button
					className="mr-2"
					variant={mode === "view" ? "outline" : "destructive"}
					onClick={() => {
						if (mode === "view") {
							setMode("edit");
							setSelectedCell({
								rowIndex: -1,
								colIndex: -1,
							});
						} else if (mode === "edit") {
							setMode("view");
							setSelectedCell({
								rowIndex: -1,
								colIndex: -1,
							});
						}
					}}
				>
					{mode === "view" ? "Edit" : "Done"}
				</Button>
			</>
		);
	}

	function AddInformation() {

	}

	function DownloadButton() {
		const [filename, setFilename] = useState("bonus");
		return (
			<div className={mode != "view" ? "cursor-not-allowed" : ""}>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={"outline"} disabled={mode !== "view"}>
							Download
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Download Excel File</DialogTitle>
							<DialogDescription>
								You may change the text and background color in
								each cell before download.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="name" className="text-right">
									Export Filename
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
							<Button
								type="submit"
								onClick={() =>
									handleExportExcel(
										sheets,
										`${filename}.xlsx`,
										t
									)
								}
							>
								Download
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col grow">
				{/* Top controls section */}
				<div className="grid w-full grid-cols-4 gap-4 mb-2">
					<div className="col-span-3 flex items-center space-x-4">
						<SelectSheetComponent />
						{filter_component}
					</div>
					<div className="col-span-1 flex items-center justify-end space-x-4">
						<ColorControlComponent />
						<EditButton />
						<DownloadButton />
					</div>
				</div>

				{/* SheetTable section */}
				<div className="flex grow overflow-auto justify-center">
					<SheetTable />
				</div>
			</div>
		</>
	);
};

export default ExcelViewer;
