import { Cross2Icon, FileTextIcon, UploadIcon } from "@radix-ui/react-icons";
import { NextPageWithLayout } from "../_app";
import { ReactElement, useState, useCallback, useEffect } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";

/* ShadCN UI */
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "~/components/ui/dialog"


import { Toaster, toast } from "sonner";

import Dropzone, {
	type DropzoneProps,
	type FileRejection,
} from "react-dropzone";

import { cn } from "~/lib/utils";

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
import { api } from "~/utils/api";

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
	 * @default 16384 * 1024 * 2 // 32MB
	 * @example maxSize={1024 * 1024 * 2} // 2MB
	 */
	maxSize?: DropzoneProps["maxSize"];

	/**
	 * Maximum number of files for the uploader.
	 * @type number | undefined
	 * @default 2
	 * @example maxFileCount={4}
	 */
	maxFileCount?: DropzoneProps["maxFiles"];

	/**
	 * Whether the uploader should accept multiple files.
	 * @type boolean
	 * @default true
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

	/* 3D array data */
	datas: Array<{ name: string; data: any[][] }>;
	setDatas: (data: Array<{ name: string; data: any[][] }>) => void;

	setSelectedFile: (filename: string) => void;

	setStatus: () => void;
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
		maxSize = 1024 * 1024 * 32,
		maxFileCount = 100,
		multiple = true,
		disabled = false,
		files,
		setFiles,
		datas,
		setDatas,
		setStatus,
		setSelectedFile,
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
			return rows;
		} catch (error) {
			console.error("Error processing file");
		}
	};

	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			// if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
			// 	toast.error("Cannot upload more than 1 file at a time");
			// 	return;
			// }

			console.log("accepted files:", acceptedFiles);
			console.log("rejected files:", rejectedFiles);

			setFiles(acceptedFiles);
			setStatus();

			let datas: Array<any> = [];

			acceptedFiles.sort((a: File, b: File) =>
				a.name.localeCompare(b.name)
			);

			acceptedFiles.map(async (file, index) => {
				datas.push({
					name: file.name,
					data: (await ExtractData(file)) ?? [],
				});
				if (index == 0) setSelectedFile(file.name);
			});

			setDatas(datas);
		},
		[]
	);

	function FileDropZone() {
		return (
			<div className="flex h-full w-full grow">
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
								"group relative grid h-full w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
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
										<p className="text-sm text-muted-foreground/70">
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
										</p>
									</div>
								</div>
							)}
						</div>
					)}
				</Dropzone>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full grow overflow-hidden">
			{/* {files.length === 0 && <FileDropZone />} */}
			<FileDropZone />
		</div>
	);
}

interface FileCardProps {
	file: File;
	onRemove: () => void;
	progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
	return (
		<div className="relative flex items-center gap-2.5">
			<div className="flex flex-1 gap-2.5">
				{/* {isFileWithPreview(file) ? <FilePreview file={file} /> : null} */}
				<div className="flex w-full flex-col gap-2">
					<div className="flex flex-col gap-px">
						<p className="line-clamp-1 text-sm font-medium text-foreground/80">
							{file.name}
						</p>
						<p className="text-xs text-muted-foreground">
							{/* {formatBytes(file.size)} */}
						</p>
					</div>
					{progress ? <Progress value={progress} /> : null}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-7"
					onClick={onRemove}
				>
					<Cross2Icon className="size-4" aria-hidden="true" />
					<span className="sr-only">Remove file</span>
				</Button>
			</div>
		</div>
	);
}

function TableViewer({ data }: any) {
	return (
		<div
			style={{
				overflowX: "auto",
				maxHeight: "600px",
				border: "1px solid #ddd",
			}}
		>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						{/* Assuming the first row contains headers */}
						{data[0] &&
							data[0].map((header: any, index: number) => (
								<th
									key={index}
									style={{
										border: "1px solid #ddd",
										padding: "8px",
									}}
								>
									{header}
								</th>
							))}
					</tr>
				</thead>
				<tbody>
					{data.slice(1).map((row: any, rowIndex: number) => (
						<tr key={rowIndex}>
							{row.map((cell: any, cellIndex: number) => (
								<td
									key={cellIndex}
									style={{
										border: "1px solid #ddd",
										padding: "8px",
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
	);
}

export default function BonusExcelImport() {
	const [status, setStatus] = useState<string>("upload");
	const [selectedFile, setSelectedFile] = useState<string>("");
	const [files, setFiles] = useState<File[]>([]);
	const [datas, setDatas] = useState<Array<{ name: string; data: any[][] }>>(
		[]
	);

	const [errorEmployees, setErrorEmployees] = useState<Array<string>>([]);

	const updateFromExcel = api.bonus.updateFromExcel.useMutation({
		onSuccess: (data) => {
			let newErrorEmployees = errorEmployees;
			data.map((d) => {
				if (!(d in newErrorEmployees))
					newErrorEmployees.push(d)
			});
			setErrorEmployees(newErrorEmployees);
		},
		onError: (error) => {
			console.error('Update failed:', error);
		},
	});
	const confirmUpdateFromExcel = api.bonus.confirmUpdateFromExcel.useMutation();

	const selectedFileIdx = () =>
		datas.findIndex((d) => d.name === selectedFile);


	function recoverObject(data: Array<any>) {
		return data.slice(1).map((d) => {
			return {
				period_id: d[1],
				bonus_type: d[2],
				emp_no: d[3],
				special_multiplier: d[4],
				multiplier: d[5],
				fixed_amount: d[6],
				budget_effective_salary: d[7],
				budget_amount: d[8],
				supervisor_performance_level: d[9],
				supervisor_effective_salary: d[10],
				supervisor_amount: d[11],
				approved_performance_level: d[12],
				approved_effective_salary: d[13],
				approved_amount: d[14],
			}
		})
	}


	return (
		<div className="grow flex-col">
			<Tabs
				className="flex h-full w-full flex-col"
				value={status}
				onValueChange={(v) => setStatus(v)}
			>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upload">Upload</TabsTrigger>
					<TabsTrigger value="preview" disabled={files.length == 0}>
						Preview
					</TabsTrigger>
				</TabsList>
				<TabsContent value="upload" className="m-2 flex grow">
					<FileUploader
						onUpload={async (files: File[]) => console.log(files)}
						files={files}
						setFiles={setFiles}
						datas={datas}
						setDatas={setDatas}
						setStatus={() => setStatus("preview")}
						setSelectedFile={setSelectedFile}
					/>
				</TabsContent>
				<TabsContent value="preview">
					<div className="mb-2 flex w-full items-center justify-between">
						<Select
							value={selectedFile}
							onValueChange={setSelectedFile}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select a fruit" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Filename</SelectLabel>
									{files.map((f) => (
										<SelectItem key={f.name} value={f.name}>
											{f.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>

						<Dialog open={errorEmployees.length != 0} onOpenChange={() => setErrorEmployees([])}>
						<DialogContent>
							<DialogHeader>
							<DialogTitle>Are you absolutely sure to update bonus table?</DialogTitle>
							<DialogDescription>
							</DialogDescription>
							</DialogHeader>
							These are the bug employees
								{errorEmployees.map((emp) => {
									return <>
									<p>{emp}</p>
									</>
								})}
							<Button 
								variant={"outline"}
								onClick={() => {
									datas.map(async(data: any) => {
										confirmUpdateFromExcel.mutate(recoverObject(data!.data as any) as any);
									})
									setErrorEmployees([]);
							}}>
								Update
							</Button>
						</DialogContent>
						</Dialog>
						<Button
							variant={"outline"}
							onClick={() => {
								datas.map(async(data: any) => {
									updateFromExcel.mutate(recoverObject(data!.data as any) as any);
								})
							}}
							className=""
						>
							Update
						</Button>
					</div>

					<div className="flex grow overflow-auto border border-gray-300">
						<table className="w-full border-collapse">
							<thead>
								<tr>
									{/* Assuming the first row contains headers */}
									{datas[selectedFileIdx()] &&
										(
											datas[selectedFileIdx()]!
												.data![0] ?? []
										).map((header: any, index: number) => (
											<th
												key={index}
												className="border border-gray-300 p-2"
											>
												{header}
											</th>
										))}
								</tr>
							</thead>
							<tbody>
								{datas[selectedFileIdx()] &&
									datas[selectedFileIdx()]!.data!.slice(
										1
									).map((row: any, rowIndex: number) => (
										<tr key={rowIndex}>
											{row.map(
												(
													cell: any,
													cellIndex: number
												) => (
													<td
														key={cellIndex}
														className="border border-gray-300 p-2"
													>
														{cell}
													</td>
												)
											)}
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
