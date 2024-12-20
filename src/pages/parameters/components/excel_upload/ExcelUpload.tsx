import { Cross2Icon, FileTextIcon, UploadIcon } from "@radix-ui/react-icons";
import { ReactElement, useState, useCallback, useEffect, useContext } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";

/* ShadCN UI */
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Toaster, toast } from "sonner";

import Dropzone, {
	type DropzoneProps,
	type FileRejection,
} from "react-dropzone";

import { cn } from "~/lib/utils";

import ExcelJS from "exceljs";
import { isDateType } from "~/lib/utils/check_type";
import { displayData } from "~/components/synchronize/utils/display";
import { useTranslation } from "next-i18next";
import { inverse_translate } from "public/locales/utils";
import { formatDate } from "~/lib/utils/format_date";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { parameterToolbarFunctionsContext } from "../function_sheet/parameter_functions_context";

export function formatBytes(
	bytes: number,
	opts: {
		decimals?: number;
		sizeType?: "accurate" | "normal";
	} = {}
) {
	const { decimals = 0, sizeType = "normal" } = opts;

	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
	if (bytes === 0) return "0 Byte";
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
		sizeType === "accurate"
			? accurateSizes[i] ?? "Bytest"
			: sizes[i] ?? "Bytes"
	}`;
}

export function composeEventHandlers<E>(
	originalEventHandler?: (event: E) => void,
	ourEventHandler?: (event: E) => void,
	{ checkForDefaultPrevented = true } = {}
) {
	return function handleEvent(event: E) {
		originalEventHandler?.(event);

		if (
			checkForDefaultPrevented === false ||
			!(event as unknown as Event).defaultPrevented
		) {
			return ourEventHandler?.(event);
		}
	};
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Value of the uploader.
	 * @type File[]
	 * @default undefined
	 * @example value={files}
	 */
	value?: File[];

	/**
	 * Function to be called when the value changes.
	 * @type (files: File[]) => void
	 * @default undefined
	 * @example onValueChange={(files) => setFiles(files)}
	 */
	onValueChange?: (files: File[]) => void;

	/**
	 * Function to be called when files are uploaded.
	 * @type (files: File[]) => Promise<void>
	 * @default undefined
	 * @example onUpload={(files) => uploadFiles(files)}
	 */
	onUpload?: (file: File[]) => Promise<void>;

	/**
	 * Progress of the uploaded files.
	 * @type Record<string, number> | undefined
	 * @default undefined
	 * @example progresses={{ "file1.png": 50 }}
	 */
	progresses?: Record<string, number>;

	/**
	 * Accepted file types for the uploader.
	 * @type { [key: string]: string[]}
	 * @default
	 * ```ts
	 * { "image/*": [] }
	 * ```
	 * @example accept={["image/png", "image/jpeg"]}
	 */
	accept?: DropzoneProps["accept"];

	/**
	 * Maximum file size for the uploader.
	 * @type number | undefined
	 * @default 1024 * 1024 * 2 // 2MB
	 * @example maxSize={1024 * 1024 * 2} // 2MB
	 */
	maxSize?: DropzoneProps["maxSize"];

	/**
	 * Maximum number of files for the uploader.
	 * @type number | undefined
	 * @default 1
	 * @example maxFileCount={4}
	 */
	maxFileCount?: DropzoneProps["maxFiles"];

	/**
	 * Whether the uploader should accept multiple files.
	 * @type boolean
	 * @default false
	 * @example multiple
	 */
	multiple?: boolean;

	/**
	 * Whether the uploader is disabled.
	 * @type boolean
	 * @default false
	 * @example disabled
	 */
	disabled?: boolean;

	/* Handle files */
	files: File[];
	setFiles: (files: File[]) => void;

	/* 2D array data */
	data: any[][];
	setData: (data: any[][]) => void;
}

export function FileUploader(props: FileUploaderProps) {
	const {
		value: valueProp,
		onValueChange,
		onUpload,
		progresses,
		accept = {
			"text/csv": [".csv"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				[".xlsx"],
		},
		maxSize = 1024 * 1024 * 2,
		maxFileCount = 1,
		multiple = false,
		disabled = false,
		files,
		setFiles,
		data,
		setData,
		className,
		...dropzoneProps
	} = props;

	const ExtractData = async (file: File) => {
		if (!file) return;
		try {
			// Read the file as ArrayBuffer
			const arrayBuffer = await file.arrayBuffer();

			// Create a new workbook
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(arrayBuffer);

			// Access the first sheet
			const sheet = workbook.worksheets[0];
			const rows: any[][] = [];

			// Extract data from the sheet
			sheet!.eachRow({ includeEmpty: true }, (row: any) => {
				rows.push(row.values);
			});

			const newRows = rows.slice(1).map((row, index) => {
				row = row.slice(2);
				return {
					salary_start: row[0],
					salary_end: row[1],
					dependent: row[2],
					tax_amount: row[3],
				};
			});

			// call api if needed
			// createAPI.mutate(newRows)

			// Update state with the extracted data
			setData(rows);
		} catch (error) {
			console.error("Error processing file");
		}
	};

	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
				toast.error("Cannot upload more than 1 file at a time");
				return;
			}

			setFiles(acceptedFiles);

			acceptedFiles.forEach((file) => {
				ExtractData(file);
			});
		},
		[]
	);

	function FileDropZone() {
		return (
			<>
				<Dropzone
					onDrop={onDrop}
					accept={accept}
					maxSize={maxSize}
					maxFiles={maxFileCount}
					multiple={maxFileCount > 1 || multiple}
					//   disabled={isDisabled}
				>
					{({ getRootProps, getInputProps, isDragActive }) => (
						<div
							{...getRootProps()}
							className={cn(
								"group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
								"ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isDragActive && "border-muted-foreground/50",
								disabled && "pointer-events-none opacity-60",
								className
							)}
							{...dropzoneProps}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<div className="flex flex-col items-center justify-center gap-4 sm:px-5">
									<div className="rounded-full border border-dashed p-3">
										<UploadIcon
											className="size-7 text-muted-foreground"
											aria-hidden="true"
										/>
									</div>
									<p className="font-medium text-muted-foreground">
										Drop the files here
									</p>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center gap-4 sm:px-5">
									<div className="rounded-full border border-dashed p-3">
										<UploadIcon
											className="size-7 text-muted-foreground"
											aria-hidden="true"
										/>
									</div>
									<div className="flex flex-col gap-px">
										<p className="font-medium text-muted-foreground">
											Drag & drop files here, or click to
											select files
										</p>
										{/* <p className="text-sm text-muted-foreground/70">
											You can upload
											{maxFileCount > 1
												? ` ${
														maxFileCount ===
														Infinity
															? "multiple"
															: maxFileCount
												  }
						files (up to ${formatBytes(maxSize)} each)`
												: ` a file with ${formatBytes(
														maxSize
												  )}`}
										</p> */}
									</div>
								</div>
							)}
						</div>
					)}
				</Dropzone>
			</>
		);
	}

	return (
		<div className="relative flex flex-col gap-6 overflow-hidden">
			{<FileDropZone />}
		</div>
	);
}


export function recoverData(data: any): Record<string, any>[] {
	if (!Array.isArray(data) || data.length === 0) {
		// Handle cases where data is not an array or is empty
		return [];
	}

	// Step 1: Generate keys by applying inverse_translate to each header
	const keys = data[0].map((original_header: string) =>
		inverse_translate(String(original_header))
	);

	// Step 2: Map each row to an object using the keys
	const mappedData = data.slice(1).map((row: any[]) => {
		return row.reduce(
			(obj: Record<string, any>, value: any, index: number) => {
				// Ensure that the index exists in keys to prevent undefined keys
				if (keys[index] !== undefined) {
					obj[keys[index]] = value;
				}
				return obj;
			},
			{}
		);
	});

	// Step 3: Check if the last object is empty and remove it if so
	while (
		mappedData.length > 0 &&
		Object.keys((mappedData as any)[mappedData.length - 1]).length === 0
	) {
		mappedData.pop();
	}

	return mappedData;
}

export function ExcelUpload({
    closeDialog
}: {
    closeDialog: () => void
}) {

    const functions = useContext(parameterToolbarFunctionsContext);
    const batchCreateFunction = functions.batchCreateFunction!;

	const [view, setView] = useState("upload");
	const [files, setFiles] = useState<File[]>([]);
	const [data, setData] = useState<any[]>([]);

	const { t } = useTranslation("common");

	useEffect(() => {
		setView("preview");
	}, [data]);

    useEffect(() => {
        setView("upload");
    }, [])

	return (
		<>
			<Tabs defaultValue="upload" value={view} onValueChange={setView} className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upload">
						{t("button.excel_upload")}
					</TabsTrigger>
					<TabsTrigger value="preview" disabled={data.length === 0}>
						{t("button.excel_preview")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="upload">
					<FileUploader
						onUpload={async (files: File[]) => console.log(files)}
						files={files}
						setFiles={setFiles}
						data={data}
						setData={setData}
					/>
				</TabsContent>

				<TabsContent value="preview">
					{/* <Button onClick={() => console.log(data)}>Console Log Data</Button> */}

					<div className="max-h-[600px] max-w-full overflow-x-auto border border-gray-300">
						<Table className="w-full table-auto">
							<TableHeader>
								<TableRow>
									{data[0] &&
										data[0].map(
											(header: any, index: number) => {
												if (index == 0) return <></>;
												else
													return (
														<TableHead key={index}>
															{header}
														</TableHead>
													);
											}
										)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{data
									.slice(1)
									.map((row: any, rowIndex: number) => (
										<TableRow key={rowIndex}>
											{row.map(
												(
													cell: any,
													cellIndex: number
												) => {
													if (cellIndex == 0)
														return <></>;
													else
														return (
															<TableCell
																key={cellIndex}
															>
																{isDateType(
																	cell
																)
																	? formatDate(
																			"day",
																			cell
																	  )
																	: cell}
															</TableCell>
														);
												}
											)}
										</TableRow>
									))}
							</TableBody>
						</Table>
					</div>

					{data[0] && (
                        <div className="flex justify-end mt-4">
						<Button
                            className="ml-auto"
                            onClick={() => {
                                // console.log(recoverData(data.map((d) => d.slice(1))))
                                batchCreateFunction.mutate(recoverData(data.map((d) => d.slice(1))))
                                closeDialog();
                            }}>
							{t("button.excel_upload")}
						</Button>
                        </div>
					)}
				</TabsContent>
			</Tabs>
		</>
	);
}
