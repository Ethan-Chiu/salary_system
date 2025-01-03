import { useContext, useEffect, useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { DataTable } from "./history_data_table";
import { useTranslation } from "react-i18next";
import {
	type HistoryDataType,
	type EmployeeHistoryQueryFunctionType,
} from "~/components/data_table/history_data_type";
import { type ColumnDef } from "@tanstack/react-table";
import { Separator } from "~/components/ui/separator";
import {
	EmployeePopoverSelector,
	type PopoverSelectorDataType,
} from "~/components/popover_selector";
import periodContext from "~/components/context/period_context";
import { getTableMapper } from "../../tables/table_columns";
import dataTableContext from "../context/data_table_context";
import { FunctionMode } from "../function_sheet/data_table_functions";
import { HistoryViewMenuItem } from "~/components/data_table/history_view/history_view_menu_item";
import { HistoryViewMenu } from "~/components/data_table/history_view/history_view_menu";
import { buildEmployeeSelectOptions } from "~/components/data_table/history_view/utils";

export interface EmployeeHistoryViewCommonEmpInfo {
	emp_name?: string;
	emp_no: string;
}

type DataRow = EmployeeHistoryViewCommonEmpInfo & HistoryDataType;

interface DataTableProps<TData extends DataRow> {
	columns: ColumnDef<TData, any>[];
	dataFunction: EmployeeHistoryQueryFunctionType<TData>;
}

export function HistoryView<TData extends DataRow>({
	columns,
	dataFunction,
}: DataTableProps<TData>) {
	const { t } = useTranslation(["common"]);
	const [open, setOpen] = useState<boolean>(false);
	const [mode, setMode] = useState<FunctionMode>("none");
	const { selectedTableType } = useContext(dataTableContext);

	const { isLoading, isError, data, error } = dataFunction();

	const { selectedPeriod } = useContext(periodContext);

	const [selectedEmpNo, setSelectedEmpNo] = useState<string | null>(null);
	const [selectedEmpDataList, setSelectedEmpDataList] = useState<DataRow[]>(
		[]
	);
	const [selectedEmpData, setSelectedEmpData] = useState<DataRow | null>(
		null
	);

	// Select the first when data loaded
	useEffect(() => {
		if (!isLoading && data?.[0] && data?.[0]?.[0]) {
			setSelectedEmpData(data[0][0]);
			setSelectedEmpNo(data[0][0].emp_no);
			const newSelectedEmpDataList = data?.find(
				(empDataList) => empDataList[0]?.emp_no === data[0]?.[0]?.emp_no
			);
			if (newSelectedEmpDataList) {
				setSelectedEmpDataList(newSelectedEmpDataList);
			}
		}
	}, [isLoading, data]);

	useEffect(() => {
		const newSelectedEmpDataList = data?.find(
			(empDataList) => empDataList[0]?.emp_no === selectedEmpNo
		);
		if (
			newSelectedEmpDataList &&
			!newSelectedEmpDataList.find(
				(empData) => empData.id === selectedEmpData?.id
			) &&
			newSelectedEmpDataList[0]
		) {
			setSelectedEmpData(newSelectedEmpDataList[0]);
			setSelectedEmpDataList(newSelectedEmpDataList);
		}
	}, [selectedEmpNo, data, selectedEmpData]);

	if (isLoading) {
		return (
			<div className="flex grow items-center justify-center">
				<LoadingSpinner />
			</div>
		); // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (!data) {
		return <div />;
	}

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={25} minSize={15}>
				<div className="flex h-full flex-col">
					<EmployeePopoverSelector
						data={buildEmployeeSelectOptions(data)}
						selectedKey={selectedEmpNo}
						setSelectedKey={setSelectedEmpNo}
					/>
					<Separator />
					<HistoryViewMenu>
						{selectedEmpDataList.map((e) => (
							<HistoryViewMenuItem
								key={e.id}
								id={e.id}
								selected={e.id === selectedEmpData?.id}
								period={selectedPeriod}
								startDate={e.start_date} // TODO: start_date should not be null
								endDate={e.end_date}
								updateBy={e.update_by}
								onClick={() => setSelectedEmpData(e)}
							/>
						))}
					</HistoryViewMenu>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={75}>
				{selectedEmpData ? (
					<>
						<DataTable
							columns={columns}
							data={
								selectedEmpData
									? getTableMapper(selectedTableType)([
											selectedEmpData,
									  ])
									: []
							}
						/>
					</>
				) : (
					<>
						<p>No find selected</p>
					</>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
