import { api } from "~/utils/api";
import { Translate } from "~/lib/utils/translation";
import ExcelViewer from "./ExcelViewer";
import { LoadingSpinner } from "~/components/loading";
import { Button } from "~/components/ui/button";

export default function ExportPage({
	selectedIndex,
	setSelectedIndex,
}: {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	const getExcelA = api.function.getExcelA.useQuery();

	function getExcelData(Alldatas: any[]) {
		const excelData: any = [];
		Alldatas.map((sheetDatas: any) => {
			const name: string = sheetDatas.name;
			try {
				const datas = sheetDatas.data;
				const columns = Object.keys(datas[0]).map((key: string) =>
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
