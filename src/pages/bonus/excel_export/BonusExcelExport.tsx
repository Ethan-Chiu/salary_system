import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../../_app";
import { useContext, useState } from "react";
import ExcelViewer from "./ExcelViewer";
import { LoadingSpinner } from "~/components/loading";
import periodContext from "~/components/context/period_context";
import dataTableContext from "../components/context/data_table_context";

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

import { useTranslation } from "next-i18next";

export function BonusExcelExport() {
	// const getExcelA = api.function.getExcelA.useQuery();
	const { selectedPeriod } = useContext(periodContext);
	const { selectedBonusType } = useContext(dataTableContext);

	const getExcelA = api.bonus.getAllEmployeeBonus.useQuery({
		period_id: selectedPeriod?.period_id ?? 0,
		bonus_type: selectedBonusType,
	});

	function getBonusExcel(data: any) {
		return data.map((d: any) => {
			return {
				id: d.id,
				period_id: d.period_id,
				bonus_type: d.bonus_type,
				emp_no: d.emp_no,
				special_multiplier: d.special_multiplier,
				multiplier: d.multiplier,
				fixed_amount: d.fixed_amount,
				budget_effective_salary: d.budget_effective_salary,
				budget_amount: d.budget_amount,
				supervisor_performance_level: d.supervisor_performance_level,
				supervisor_effective_salary: d.supervisor_effective_salary,
				supervisor_amount: d.superviser_amount,
				approved_performance_level: d.approved_performance_level,
				approved_effective_salary: d.approved_effective_salary,
				final_amount: d.final_amount,
			};
		})
	}


	if (getExcelA.isFetched) {
		console.log(getExcelA.data)
	}

	// const getExcelA = api.transaction.getAllTransaction.useQuery({
	// 	period_id: selectedPeriod?.period_id ?? 0
	// });

	const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);

	const [toExcludedColumns, setToExcludedColumns] = useState([
		"id", "create_by", "create_date", "update_by", "update_date"
	]);

	const [toDisplayData, setToDisplayData] = useState<any>(null);
	
	function ExcludeDataColumn(dataList: any, excludedColumns: Array<string>) {
		interface keyValuePair {
			[key: string]: any;
		}
		const testDataList = [
			{
				name: "test",
				data: dataList
			}
		]
		return testDataList.map((data: any) => {
			const sheetName = data.name;
			const sheetData = data.data.map((row: keyValuePair) => {
				const newRow: keyValuePair = {};
				Object.keys(row).forEach((key) => {
					if (!excludedColumns.includes(key)) {
						newRow[key] = row[key];
					}
				});
				return newRow;
			});
			return {
				name: sheetName,
				data: sheetData,
			};
		})
	}

	function createSchema() {
		const testData = [{
			name: "test",
			data: getBonusExcel(getExcelA.data!)
		}]
		const keys = (getExcelA.isFetched) ? Object.keys(
			testData.map((sheet: any) => sheet.data[0])[selectedSheetIndex]
		) : [];
		const schemaShape = keys.reduce((acc: any, key) => {
			if (toExcludedColumns.includes(key)) {
				acc[key] = z.boolean().optional().default(false);
			}
			else {
				acc[key] = z.boolean().optional().default(true);
			}
			return acc;
		}, {});
		const schema = z.object(schemaShape);
		return schema;
	}

	function FilterComponent() {
		const [formValues, setFormValues] = useState(
			getDefaults(createSchema())
		)
		const [open, setOpen] = useState(false);
		return (
			<>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button variant="outline">Keys</Button>
					</SheetTrigger>
					<SheetContent className="w-[40%]">
						<SheetHeader>
							<SheetTitle>Set show keys</SheetTitle>
							<SheetDescription>
								Show some keys in the excel table
							</SheetDescription>
						</SheetHeader>
						<ScrollArea className="h-[85%] w-full">
							<AutoForm 
								formSchema={createSchema()}
								values={formValues}
								onValuesChange={setFormValues}
								onSubmit={(data) => {
									setOpen(false)
									// changeShowKeys("Sheet1", data);
									let newExcludedColumns = [];
									for (const [key, value] of Object.entries(data)) {
										if (!value) newExcludedColumns.push(key);
									}
									setToExcludedColumns(newExcludedColumns);
									setToDisplayData(
										getExcelData(ExcludeDataColumn(getExcelA.data!, newExcludedColumns))
									);
								}}
							>			
							<Button>
								Submit
							</Button>				
							</AutoForm>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>
						
					</SheetContent>
				</Sheet>
			</>
		);
	}

	return (
		<>
			{getExcelA.isFetched ? (
					<div className="flex grow overflow-auto">
						<ExcelViewer
							original_sheets={
								toDisplayData ?? getExcelData(ExcludeDataColumn(getBonusExcel(getExcelA.data!), toExcludedColumns))
							}
							filter_component={<FilterComponent />}
							selectedSheetIndex={selectedSheetIndex}
							setSelectedSheetIndex={setSelectedSheetIndex}
						/>
					</div>

			) : (
				<div className="flex grow items-center justify-center">
					<LoadingSpinner />
				</div>
			)}
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
