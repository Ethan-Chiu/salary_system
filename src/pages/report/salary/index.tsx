import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { useContext, useState } from "react";
import { ProgressBar } from "~/components/functions/progress_bar";
import { Translate } from "~/lib/utils/translation";
import ExcelViewer from "./ExcelViewer";
import { LoadingSpinner } from "~/components/loading";
import periodContext from "~/components/context/period_context";

const Salary: NextPageWithLayout = () => {
	return <>
		<div className="flex h-full flex-col p-4">
			<Header title="salary report" showOptions className="mb-4" />
			<ExportPage />
		</div>
	</>
};

Salary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="reports">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Salary;

function ExportPage({}: {
}) {
	// const getExcelA = api.function.getExcelA.useQuery();
	const { selectedPeriod } = useContext(periodContext);
	console.log(selectedPeriod);
	const pseudoDatas = [
		{
		  name: 'Sheet1',
		  data: [
			{ Name: 'John', Age: 25, City: 'New York' },
			{ Name: 'Alice', Age: 30, City: 'San Francisco' },
			{ Name: 'Bob', Age: 22, City: 'Los Angeles' },
			{ Name: 'Eva', Age: 28, City: 'Chicago' },
			// Add more rows as needed
		  ],
		},
		{
		  name: 'Sheet2',
		  data: [
			{ Product: 'Laptop', Price: 1200, Stock: 10 },
			{ Product: 'Phone', Price: 800, Stock: 20 },
			// Add more rows as needed
		  ],
		},
		// Add more sheets as needed
	  ];
	const getExcelA = {
		isFetched: true,
		data: pseudoDatas
	};
	
	function getExcelData(Alldatas: any) {
		let excelData: any = [];
		Alldatas.map((sheetDatas: any) => {
			let name: string = sheetDatas.name;
			try {
				let datas = sheetDatas.data;
				let columns = Object.keys(datas[0]).map((key: string) =>
					// Translate(key)
					key
				);
				let rows = datas.map((data: any, index: number) => {
					return Object.keys(data).map((key: string) => {
						return data[key];
					});
				});
				rows.unshift(columns);
				excelData.push({ sheetName: name, data: rows });
			} catch (e) {
				console.log(e);
				excelData.push({
					sheetName: name,
					data: [["test col 1", "test col 2"], [123, 456]],
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
						<ExcelViewer original_sheets={getExcelData(getExcelA.data)} />
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
