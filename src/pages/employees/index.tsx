import { NextPageWithLayout } from "../_app";
import { Header } from "~/components/header";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { ReactElement, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmployeeDataTable } from "./tables/employee_data_table";
import { EmployeePaymentTable } from "./tables/employee_payment_table";
import { EmployeeTrustTable } from "./tables/employee_trust_table";
import DataTableContextProvider from "./components/context/data_table_context_provider";
import dataTableContext from "./components/context/data_table_context";
import periodContext from "~/components/context/period_context";

const TabOptions = ["基本檔案", "薪資檔案", "持股信託"];

const PageEmployeesContent = () => {
	const { setSelectedTableType } = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);
	function getTable(table_name: string) {
		if (selectedPeriod == null) {
			return <p>Please select period first</p>;
		}
		switch (table_name) {
			case TabOptions[0]:
				return <EmployeeDataTable period_id={selectedPeriod.period_id} />
			case TabOptions[1]:
				return <EmployeePaymentTable period_id={selectedPeriod.period_id} />
			case TabOptions[2]:
				return <EmployeeTrustTable period_id={selectedPeriod.period_id} />
			default:
				return <p>No implement</p>;
		}
	}

	function getTypeByOption(options: string) {
		switch (options) {
			case TabOptions[1]:
				return "TableEmployeePayment";
			case TabOptions[2]:
				return "TableEmployeeTrust";
			default:
				return "TableEmployeePayment";
		}
	}

	return (
		<div className="flex h-full w-full flex-col">
			<Header title="employees" showOptions className="mb-4" />
			<div className="m-4 h-0 grow">
				<Tabs
					defaultValue={TabOptions[0]}
					className="flex h-full w-full flex-col"
				>
					<TabsList className={"grid w-full grid-cols-3"}>
						{TabOptions.map((option) => {
							return (
								<TabsTrigger
									key={option}
									value={option}
									onClick={() =>
										setSelectedTableType(
											getTypeByOption(option)
										)
									}
								>
									{option}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{TabOptions.map((option) => {
							return (
								<TabsContent
									key={option}
									value={option}
									className="h-full"
								>
									{getTable(option)}
								</TabsContent>
							);
						})}
					</div>
				</Tabs>
			</div>
		</div>
	);
};

const PageEmployees: NextPageWithLayout = () => {
	return (
		<DataTableContextProvider>
			<PageEmployeesContent />
		</DataTableContextProvider>
	);
};

PageEmployees.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="employees">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageEmployees;
