import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { type NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { type ReactElement, useContext, useState } from "react";
import { ProgressBar } from "~/components/functions/progress_bar";
import { LoadingSpinner } from "~/components/loading";
import { DataPage } from "./data_page";
import { EmployeePage } from "./employee_page";
import periodContext from "~/components/context/period_context";
import { SyncPage } from "./sync_page";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useRouter } from "next/router";
import { type PaidEmployee } from "~/server/service/sync_service";
import { SalaryCalculatePage } from "./salary_calculate_page";
import { FunctionsEnum } from "~/server/api/types/functions_enum";

type FunctionStepPage = {
	title: string;
	page: ReactElement;
};

const MonthSalary: NextPageWithLayout = () => {
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

	return <MonthSalaryContent periodId={periodId} />;
};

function MonthSalaryContent({ periodId }: { periodId: number }) {
	const router = useRouter();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const { isLoading, isError, data, error } =
		api.sync.getCandEmployees.useQuery({
			func: FunctionsEnum.enum.month_salary,
			period: periodId,
		});

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	const pageList: FunctionStepPage[] = [
		{
			title: "同步員工資料",
			page: (
				<SyncPage
					key="sync"
					period={periodId}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: "薪資發放名單檢核",
			page: (
				<EmployeePage
					key="employee"
					period={periodId}
					func={FunctionsEnum.enum.month_salary}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		{
			title: "確認資料",
			page: (
				<DataPage
					key="data"
					period={periodId}
					func={FunctionsEnum.enum.month_salary}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
				/>
			),
		},
		// {
		// 	title: "確認參數",
		// 	page: (
		// 		<ParameterPage
		// 			key="parameter"
		// 			period={periodId}
		// 			selectedIndex={selectedIndex}
		// 			setSelectedIndex={setSelectedIndex}
		// 		/>
		// 	),
		// },
		{
			title: "薪資計算",
			page: (
				<SalaryCalculatePage
					key="salary_calculate"
					period={periodId}
					func={FunctionsEnum.enum.month_salary}
				/>
			),
		},
	];
	const titles: string[] = pageList.map((page) => page.title);

	// const hasBug = data.some((cand) => cand.bug !== undefined);
	const hasBug = false;

	return (
		<AlertDialog
			open={hasBug}
			onOpenChange={(open) => {
				if (!open) {
					void router.replace("/functions");
				}
			}}
		>
			<div className="flex flex-col h-full">
				<Header title="functions" showOptions />
				<div className="flex flex-col grow p-4">
					<ProgressBar labels={titles} selectedIndex={selectedIndex} />
					<div className="h-4" />
					{pageList[selectedIndex]?.page ?? <></>}
				</div>
			</div>
			<CompAlert data={data} />
		</AlertDialog>
	);
}

function CompAlert({ data }: { data: PaidEmployee[] }) {
	return (
		<AlertDialogContent className="w-[90vw]">
			<AlertDialogHeader>
				<AlertDialogTitle>There are bugs in the data</AlertDialogTitle>
				<AlertDialogDescription>
					Please resolve these bugs before proceed. You might need to
					contact the EHR team.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<div className="m-4">
				{data.map((cand) => {
					return (
						cand.bug && (
							<div
								key={cand.emp_no}
								className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
							>
								<span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none">
										{`${cand.name} (${cand.emp_no})`}
									</p>
									<p className="text-sm text-muted-foreground">
										{cand.bug}
									</p>
								</div>
							</div>
						)
					);
				})}
			</div>
			<AlertDialogFooter>
				<AlertDialogAction>Continue</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}

MonthSalary.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default MonthSalary;
