import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../../_app";
import { useContext, useState } from "react";
import ExcelViewer from "./ExcelViewer";
import { LoadingSpinner } from "~/components/loading";
import periodContext from "~/components/context/period_context";

import { getExcelData, getDefaults } from "./utils";
import { keyDict } from "./utils";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";
import { Button } from "~/components/ui/button";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import AutoForm from "~/components/ui/auto-form";
import { z } from 'zod';

import { api } from "~/utils/api";

const Salary: NextPageWithLayout = () => {
	return (
		<>
			<div className="flex h-full flex-col p-4">
				<Header title="salary report" showOptions className="mb-4" />
				<ExportPage />
			</div>
		</>
	);
};

Salary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="reports">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Salary;

function ExportPage() {
	// const getExcelA = api.function.getExcelA.useQuery();
	const { selectedPeriod } = useContext(periodContext);
	console.log(selectedPeriod);

	const getExcelA = api.transaction.getAllTransaction.useQuery({
		period_id: selectedPeriod?.period_id ?? 0
	});

	console.log(getExcelA.data);

	// const incomeDatas = [
	// 	{
	// 		name: "Sheet1",
	// 		data: [
	// 			{ base_salary: "John", Age: 25, City: "New York" },
	// 			{ base_salary: "Alice", Age: 30, City: "San Francisco" },
	// 			{ base_salary: "Bob", Age: 22, City: "Los Angeles" },
	// 			{ base_salary: "Eva", Age: 28, City: "Chicago" },
	// 			// Add more rows as needed
	// 		],
	// 	},
	// 	{
	// 		name: "Sheet2",
	// 		data: [
	// 			{ Product: "Laptop", Price: 1200, Stock: 10 },
	// 			{ Product: "Phone", Price: 800, Stock: 20 },
	// 			// Add more rows as needed
	// 		],
	// 	},
	// 	// Add more sheets as needed
	// ];

	// const [showKeys, setShowKeys] = useState({
	// 	"transaction": {
	// 		"emp_no": true,

	// 	}
	// });

	// function changeShowKeys(sheetName: string, newDict: any) {
	// 	setShowKeys({ ...showKeys, [sheetName]: newDict });
	// }
	
	// function getPseudoDatas(showKeys: any) 
	// {
	// 	return (getExcelA.isFetched ? (getExcelA.data ?? []) : []).map((sheetData) => {
	// 		console.log(sheetData);
	// 		const sheetName = sheetData.name;
	// 		const data = sheetData.data;
	// 		const keys = Object.keys((showKeys as any)[sheetName]).filter((key: string) => (showKeys as any)[sheetName][key]);
	// 		const pseudoData = data.map((row: any) => {
	// 			const pseudoRow: Record<string, string> = {};
	// 			keys!.forEach((key) => {
	// 				pseudoRow[key] = row[key];
	// 			});
	// 			return pseudoRow;
	// 		});
	// 		return { name: sheetName, data: pseudoData };
	// 	});
	// }

	// const [pseudoDatas, setPseudoDatas] = useState(getExcelA.data);

	// const getExcelA = {
	// 	isFetched: true,
	// 	data: pseudoDatas,
	// };

	// function createSchema() {
	// 	const keys = Object.keys(getExcelA.data!.findLast((sheet) => sheet.name == "transaction")!.data[0]);
	// 	const schemaShape = keys.reduce((acc: any, key) => {
	// 		if ((Object.keys(pseudoDatas!["transaction"]!)).includes(key)) {
	// 			acc[key] = z.boolean().optional().default(true);
	// 		}
	// 		else {
	// 			acc[key] = z.boolean().optional().default(false);
	// 		}
	// 		return acc;
	// 	}, {});
	// 	const schema = z.object(schemaShape);
	// 	return schema;
	// }

	// function FilterComponent() {
	// 	const [formValues, setFormValues] = useState(
	// 		getDefaults(createSchema())
	// 	)
	// 	const [open, setOpen] = useState(false);
	// 	return <></>
	// 	return (
	// 		<>
	// 			<Sheet open={open} onOpenChange={setOpen}>
	// 				<SheetTrigger asChild>
	// 					<Button variant="outline">Keys</Button>
	// 				</SheetTrigger>
	// 				<SheetContent className="w-[40%]">
	// 					<SheetHeader>
	// 						<SheetTitle>Set show keys</SheetTitle>
	// 						<SheetDescription>
	// 							Show some keys in the excel table
	// 						</SheetDescription>
	// 					</SheetHeader>
	// 					<ScrollArea className="h-[85%] w-full">
	// 						<AutoForm 
	// 							formSchema={createSchema()}
	// 							values={formValues}
	// 							onValuesChange={setFormValues}
	// 							onSubmit={(data) => {
	// 								setOpen(false)
	// 								changeShowKeys("Sheet1", data);
	// 								setPseudoDatas(getPseudoDatas({ ...showKeys, Sheet1: data }));
	// 							}}
	// 						>			
	// 						<Button>
	// 							Submit
	// 						</Button>				
	// 						</AutoForm>
	// 						<ScrollBar orientation="horizontal" />
	// 					</ScrollArea>
						
	// 				</SheetContent>
	// 			</Sheet>
	// 		</>
	// 	);
	// }

	return (
		<>
			{getExcelA.isFetched ? (
				<>
					<div className="grow">
						<ExcelViewer
							original_sheets={getExcelData(getExcelA.data!)}
							filter_component={<></>}
						/>
					</div>
				</>
			) : (
				<div className="flex grow items-center justify-center">
					<LoadingSpinner />
				</div>
			)}

			{/* <Button onClick={() => {
				// console.log(showKeys)
				// console.log(pseudoDatas)
			}}>
				Console.log
			</Button> */}
		</>
	);
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return {
		props: {
			...(await serverSideTranslations(
				locale,
				["common", "nav"],
				i18n,
				locales
			)),
		},
	};
};
