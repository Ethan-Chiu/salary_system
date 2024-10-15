import React, { useContext } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

import { api } from "~/utils/api";
import { type DataComparison } from "~/server/service/sync_service";
import { type SyncCheckStatusEnumType } from "~/components/synchronize/utils/sync_check_status";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import periodContext from "../context/period_context";
import { useTranslation } from "react-i18next";
import { EmployeeDataChangeTable } from "./emp_data_table_all";

export interface DataComparisonAndStatus extends DataComparison {
	check_status: SyncCheckStatusEnumType;
}

export interface SyncDataAndStatus {
	emp_no: string;
	emp_name: string;
	department: string;
	comparisons: Array<DataComparisonAndStatus>;
}

interface UpdateTableDialogProps {
	data: SyncDataAndStatus[];
}

export function UpdateTableDialog({ data }: UpdateTableDialogProps) {
	const { selectedPeriod } = useContext(periodContext);
	const { t } = useTranslation(["common"]);

	const ctx = api.useUtils();

	const { mutate } = api.sync.synchronize.useMutation({
		onSuccess: () => {
			void ctx.sync.checkEmployeeData.invalidate();
		},
	});

	function handleUpdate(period_id: number) {
		const updateList: Array<string> = [];

		mutate({
			period: period_id,
			emp_no_list: updateList,
		});
	}

	if (selectedPeriod == null) {
		return <p>{t("others.select_period")}</p>;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					onClick={() => {
						console.log("Show update table dialog");
					}}
				>
					{t("button.update")}
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[90vw] max-w-5xl p-8">
				<DialogHeader className="mx-4 flex items-center">
					<div className="mr-auto">
						<DialogTitle>{t("others.changed_data")}</DialogTitle>
						<DialogDescription>
							{t("others.changed_data_msg")}
						</DialogDescription>
					</div>
				</DialogHeader>
				<ScrollArea className="max-h-[70vh]">
					<EmployeeDataChangeTable
						data={data}
						mode="changed"
						setDataStatus={(_, __, ___) => undefined}
					/>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>

				<DialogClose asChild>
					<Button
						type="submit"
						onClick={() => handleUpdate(selectedPeriod.period_id)}
					>
						{t("button.update")}
					</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}

