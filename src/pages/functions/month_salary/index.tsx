import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { type ReactElement, useContext, useState } from "react";
import { ProgressBar } from "~/components/functions/progress_bar";
import { LoadingSpinner } from "~/components/loading";
import { ParameterPage } from "./parameters_page";
import { DataPage } from "./data_page";
import { EmployeePage } from "./employee_page";
import periodContext from "~/components/context/period_context";
import { SyncPage } from "./sync_page";
import ExportPage from "./export";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const progressBarLabels = [
	"同步員工資料",
	"薪資發放名單檢核",
	"確認資料",
	"確認參數",
	"匯出報表",
];

const MonthSalary: NextPageWithLayout = () => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const { selectedPeriod } = useContext(periodContext);

	const periodId = selectedPeriod?.period_id;

	if (!periodId) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-4">
				<div className="my-6 font-bold ">
					Please select a period and paydate{" "}
				</div>
				<Link
					className={cn(
						buttonVariants({ variant: "outline" }),
						"w-40"
					)}
					href="/functions"
				>
					Go back
				</Link>
			</div>
		);
	}

	const { isLoading, isError, data, error } =
		api.sync.getCandEmployees.useQuery({
			func: "month_salary",
			period: periodId,
		});



	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	const pageList: ReactElement[] = [
		<SyncPage
			key="sync"
			period={periodId}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<EmployeePage
			key="employee"
			period={periodId}
			func={"month_salary"}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<DataPage
			key="data"
			period={periodId}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<ParameterPage
			key="parameter"
			period={periodId}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		/>,
		<ExportPage
			key="export"
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
