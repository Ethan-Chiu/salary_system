import { type NextPageWithLayout } from "../_app";
import { Header } from "~/components/header";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { type ReactElement, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmployeeDataTable } from "./tables/employee_data_table";
import { EmployeePaymentTable } from "./tables/employee_payment/employee_payment_table";
import { EmployeeTrustTable } from "./tables/employee_trust/employee_trust_table";
import DataTableContextProvider from "./components/context/data_table_context_provider";
import dataTableContext from "./components/context/data_table_context";
import periodContext from "~/components/context/period_context";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { type EmployeeTableEnum } from "./employee_tables";

const tabOptions = ["table_name.employeeData", "table_name.employeePayment", "table_name.employeeTrust"];

function PageEmployeesContent() {
	const { setSelectedTableType} = useContext(dataTableContext);
	const { selectedPeriod } = useContext(periodContext);

	function getTable(table_name: string) {
		if (selectedPeriod == null) {
			return <p>{t("others.select_period")}</p>;
		}
		switch (table_name) {
			case tabOptions[0]:
				return <EmployeeDataTable period_id={selectedPeriod.period_id} />
			case tabOptions[1]:
				return <EmployeePaymentTable period_id={selectedPeriod.period_id} />
			case tabOptions[2]:
				return <EmployeeTrustTable period_id={selectedPeriod.period_id} />
			default:
				return <p>No implement</p>;
		}
	}

	function getTypeByOption(options: string): EmployeeTableEnum {
		switch (options) {
			case tabOptions[1]:
				return "TableEmployeePayment";
			case tabOptions[2]:
				return "TableEmployeeTrust";
			default:
				return "TableEmployeePayment";
		}
	}

	const { t } = useTranslation(['common', 'nav']);

	return (
		<div className="flex h-full w-full flex-col">
			<Header title={t("employees", { ns: "nav" })} showOptions className="mb-4" />
			<div className="m-4 h-0 grow">
				<Tabs
					defaultValue={tabOptions[0]}
					className="flex h-full w-full flex-col"
				>
					<TabsList className={"grid w-full grid-cols-3"}>
						{tabOptions.map((option) => {
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
									{t(option)}
								</TabsTrigger>
							);
						})}
					</TabsList>
					<div className="mt-2 h-0 grow">
						{tabOptions.map((option) => {
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return ({
		props: {
			...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
		}
	});
};

PageEmployees.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="employees">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageEmployees;
