import React from "react";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "~/components/loading";
import { FunctionsEnumType } from "~/server/api/types/functions_enum";
import { api } from "~/utils/api";

import { useEffect } from "react";
import { Period } from "~/server/database/entity/UMEDIA/period";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function SalaryCalculatePage({
	period,
	func,
}: {
	period: Period;
	func: FunctionsEnumType;
}) {
	const { isLoading, isError, data, error } =
		api.sync.getPaidEmployees.useQuery({ func });

	if (isLoading) {
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}
	if (data) {
		return (
			<SalaryCalculateContent
				period={period}
				emp_no_list={data.map((emp) => emp.emp_no)}
			/>
		);
	}
	return <div />;
}

function SalaryCalculateContent({
	period,
	emp_no_list,
}: {
	period: Period;
	emp_no_list: string[];
}) {
	// const { isLoading, isError, data, error } = api.calculate.calculateWeekdayOvertimePay.useQuery({ emp_no: emp_no_list[0]!, period_id: period })

	const createTransaction = api.transaction.createTransaction.useMutation({
		onSuccess: () => {
			console.log("success");
		},
		onError: (error) => {
			console.log("error");
			console.log(error);
		},
	});

	useEffect(() => {
		// createTransaction.mutate({ emp_no_list: emp_no_list, period_id: period.period_id, issue_date: period.issue_date, pay_type: "month_salary", note: "計算月薪"});
	}, []);

	const { t } = useTranslation(["common", "nav"]);

	const [start, setStart] = React.useState(false);

	function StartCalculate() {
		return (
			<div className="flex h-0 w-full flex-grow items-center justify-center">
				<Card className="w-1/2 text-center">
					<CardHeader className="p-2 pt-0 md:p-4">
						<CardTitle className="p-4">
							{t("others.start_calculate_month_salary")}
						</CardTitle>
						{/* <CardDescription></CardDescription> */}
					</CardHeader>
					<CardContent className="p-2 pt-0 md:p-4 md:pt-0">
						<Button
							onClick={() => {
								setStart(true);
								createTransaction.mutate({
									emp_no_list: emp_no_list,
									period_id: period.period_id,
									issue_date: period.issue_date,
									pay_type: "month_salary",
									note: "計算月薪",
								});
							}}
						>
							{" "}
							{t(
								"others.start_calculate_month_salary_button"
							)}{" "}
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!start) {
		return <StartCalculate />;
	}

	if (createTransaction.isSuccess) {
		return (
			<div className="flex h-0 w-full flex-grow items-center justify-center">
				<Card className="w-1/2 text-center">
					<CardHeader className="p-2 pt-0 md:p-4">
						<CardTitle className="p-4">
							{t("others.calculate_done")}
						</CardTitle>
						<CardDescription>
							<Button>
								<Link href="/report">{t("reports", { ns: "nav" })}</Link>
							</Button>
						</CardDescription>
					</CardHeader>
					<CardContent className="p-2 pt-0 md:p-4 md:pt-0"></CardContent>
				</Card>
			</div>
		);
	}

	if (createTransaction.isPending) {
		console.log("Pending...");
		return <LoadingSpinner />; // TODO: Loading element with toast
	}

	if (createTransaction.isError) {
		return <span>Error: {createTransaction.error.message}</span>; // TODO: Error element with toast
	}

	return <></>;
}
