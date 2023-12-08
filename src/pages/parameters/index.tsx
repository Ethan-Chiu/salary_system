import { RootLayout } from "~/components/layout/root_layout";
import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { api } from "~/utils/api";

import { Accordion } from "~/components/ui/accordion";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { ParameterTable } from "./tables/parameter_table";
import { DATA } from "../develop_parameters/tables/datatype";

export type SettingItem = {
	name: string;
	// type: "boolean" | "list" | "number" | "input"
	value: number | string;
	status: "pending" | "processing" | "success" | "failed";
};

let datas: DATA[] = [
	{
		table_name: "請假加班",
		table_type: "typical",
		table_content: [],
	},
]

// 基本設定、請假加班、勞健保費率
let table_names: String[] = ["請假加班", "銀行", "勞健保費率"];

const PageParameters: NextPageWithLayout = () => {
	const getAttendanceSetting = api.parameters.getCurrentAttendanceSetting.useQuery();

	// let tables_content: any = [];
	// tables.map((table: any, index: number) => {
	// 	const [showDialog, setShowDialog] = useState(false);
	// 	tables_content.push(
	// 		<AccordionItem value={"item-" + index.toString()}>
	// 			<AccordionTrigger>{table_names[index]}</AccordionTrigger>
	// 			<AccordionContent>
	// 				{/* top bar */}
	// 				<div className="flex items-center py-6">
	// 					{/* search bar */}
	// 					<Input
	// 						placeholder="Filter setting..."
	// 						value={
	// 							(table
	// 								.getColumn("name")
	// 								?.getFilterValue() as string) ?? ""
	// 						}
	// 						onChange={(event) =>
	// 							table
	// 								.getColumn("name")
	// 								?.setFilterValue(event.target.value)
	// 						}
	// 						className="max-w-sm"
	// 					/>
	// 					{/* select column to show */}
	// 					<DropdownMenu>
	// 						<DropdownMenuTrigger asChild>
	// 							<Button variant="outline" className="ml-auto">
	// 								Columns{" "}
	// 								<ChevronDown className="ml-2 h-4 w-4" />
	// 							</Button>
	// 						</DropdownMenuTrigger>
	// 						<DropdownMenuContent align="end">
	// 							{table
	// 								.getAllColumns()
	// 								.filter((column: any) =>
	// 									column.getCanHide()
	// 								)
	// 								.map((column: any) => {
	// 									return (
	// 										<DropdownMenuCheckboxItem
	// 											key={column.id}
	// 											className="capitalize"
	// 											checked={column.getIsVisible()}
	// 											onCheckedChange={(value) =>
	// 												column.toggleVisibility(
	// 													!!value
	// 												)
	// 											}
	// 										>
	// 											{column.id}
	// 										</DropdownMenuCheckboxItem>
	// 									);
	// 								})}
	// 						</DropdownMenuContent>
	// 					</DropdownMenu>
	// 				</div>
	// 				{/* table */}
	// 				<div className="rounded-md border">
	// 					<Table>
	// 						<TableHeader>
	// 							{table
	// 								.getHeaderGroups()
	// 								.map((headerGroup: any) => (
	// 									<TableRow key={headerGroup.id}>
	// 										{headerGroup.headers.map(
	// 											(header: any) => {
	// 												return (
	// 													<TableHead
	// 														key={header.id}
	// 													>
	// 														{header.isPlaceholder
	// 															? null
	// 															: flexRender(
	// 																	header
	// 																		.column
	// 																		.columnDef
	// 																		.header,
	// 																	header.getContext()
	// 															  )}
	// 													</TableHead>
	// 												);
	// 											}
	// 										)}
	// 									</TableRow>
	// 								))}
	// 						</TableHeader>
	// 						<TableBody>
	// 							{table.getRowModel().rows?.length ? (
	// 								table.getRowModel().rows.map((row: any) => (
	// 									<TableRow
	// 										key={row.id}
	// 										data-state={
	// 											row.getIsSelected() &&
	// 											"selected"
	// 										}
	// 									>
	// 										{row
	// 											.getVisibleCells()
	// 											.map((cell: any) => (
	// 												<TableCell key={cell.id}>
	// 													{flexRender(
	// 														cell.column
	// 															.columnDef.cell,
	// 														cell.getContext()
	// 													)}
	// 												</TableCell>
	// 											))}
	// 									</TableRow>
	// 								))
	// 							) : (
	// 								<TableRow>
	// 									<TableCell
	// 										colSpan={columns.length}
	// 										className="h-24 text-center"
	// 									>
	// 										No results.
	// 									</TableCell>
	// 								</TableRow>
	// 							)}
	// 						</TableBody>
	// 					</Table>
	// 				</div>
	// 				{/* buttons */}
	// 				<div className="flex items-center justify-end space-x-2 py-4">
	// 					<div className="space-x-2">
	// 						<Button
	// 							variant="outline"
	// 							size="sm"
	// 							onClick={() => {
	// 								setShowDialog(true);
	// 							}}
	// 						>
	// 							Add
	// 						</Button>
	// 						<Button
	// 							variant="outline"
	// 							size="sm"
	// 							onClick={() => table.previousPage()}
	// 							disabled={!table.getCanPreviousPage()}
	// 						>
	// 							Previous
	// 						</Button>
	// 						<Button
	// 							variant="outline"
	// 							size="sm"
	// 							onClick={() => table.nextPage()}
	// 							disabled={!table.getCanNextPage()}
	// 						>
	// 							Next
	// 						</Button>
	// 					</div>
	// 				</div>
	// 			</AccordionContent>
	// 		</AccordionItem>
	// 	);
	// });

	return (
		<>
			{/* header */}
			<Header title="parameters" showOptions />

			<Accordion type="single" collapsible className="w-full">
				<ParameterTable
					defaultData={datas[0]?.table_content}
					table_name={datas[0]?.table_name}
					table_type={datas[0]?.table_type}
					index={0}
					globalFilter={""}
					updateFunction = {(d:any) => {}}
					createFunction = {(d:any) => {}}
				/>
			</Accordion>
		</>
	);
};

PageParameters.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="parameters">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageParameters;
