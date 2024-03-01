import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { useState } from "react";
import { ProgressBar } from "~/components/functions/progress_bar";
import { Translate } from "~/lib/utils/translation";
import ExcelViewer from "./ExcelViewer";
import { LoadingSpinner } from "~/components/loading";
import { ParameterPage } from "./parameters_page";
import { DataPage } from "./data_page";
import { EmployeePage } from "./employee_page";
import { SyncPage } from "./sync_page";
import { Button } from "~/components/ui/button";

export const progressBarLabels = [
	"確認員工",
	"同步員工資料",
	"確認資料",
	"確認參數",
	"匯出報表",
];

const MonthSalary: NextPageWithLayout = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [period, setPeriod] = useState(-1);

	const pageList = [
		<EmployeePage
			period={period}
			func={"month_salary"}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<SyncPage
			period={period}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<DataPage
			period={period}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<ParameterPage
			period={period}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<ExportPage
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
	];
	return (
		<div className="flex h-full flex-col p-4">
			<Header title="functions" showOptions className="mb-4" />
			<ProgressBar
				labels={progressBarLabels}
				selectedIndex={selectedIndex}
			/>
			<div className="h-4" />
			{pageList[selectedIndex]}
		</div>
	);
};

MonthSalary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default MonthSalary;

function ExportPage({
	selectedIndex,
	setSelectedIndex,
}: {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	const getExcelA = api.function.getExcelA.useQuery();

	function getExcelData(Alldatas: any) {
		let excelData: any = [];
		Alldatas.map((sheetDatas: any) => {
			let name: string = sheetDatas.name;
			try {
				let datas = sheetDatas.data;
				let columns = Object.keys(datas[0]).map((key: string) =>
					Translate(key)
				);
				let rows = datas.map((data: any, index: number) => {
					return Object.keys(data).map((key: string) => {
						return data[key];
					});
				});
				rows.unshift(columns);
				excelData.push({ sheetName: name, data: rows });
			} catch {
				excelData.push({
					sheetName: name,
					data: [["psedu data"], [123]],
				});
			}
		});
		return excelData;
	}

	return (
		<>
			{getExcelA.isFetched ? (
				<>
					<div className="grow">
						<ExcelViewer sheets={getExcelData(getExcelA.data)} />
					</div>
					<div className="flex justify-between">
						<Button
							onClick={() => setSelectedIndex(selectedIndex - 1)}
							disabled={selectedIndex === 0}
						>
							{Translate("previous_step")}
						</Button>
						<Button
							onClick={() => setSelectedIndex(selectedIndex + 1)}
							disabled={
								selectedIndex === progressBarLabels.length - 1
							}
						>
							{Translate("next_step")}
						</Button>
					</div>
				</>
			) : (
				<div className="flex grow items-center justify-center">
					<LoadingSpinner />
				</div>
			)}
		</>
	);
}
