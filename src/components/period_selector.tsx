import { useContext, useState } from "react";
import { api } from "~/utils/api";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import periodContext from "./context/period_context";
import { Input } from "./ui/input";
import { SessionStorage } from "~/utils/session_storage";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
import { type Period } from "~/server/database/entity/UMEDIA/period";

export default function PeriodSelector() {
	const getPeriod = api.function.getPeriod.useQuery();
	const {
		selectedPeriod,
		setSelectedPeriod,
		selectedPayDate,
		setSelectedPayDate,
	} = useContext(periodContext);

	const [tmpPeriod, setTmpPeriod] = useState<Period | null>(
		selectedPeriod ?? null
	);
	const [tmpPayDate, setTmpPayDate] = useState<string | null>(
		selectedPayDate ?? null
	);

	return (
		<div className="flex flex-col items-center">
			{getPeriod.isFetched ? (
				<>
					<div className="flex w-full p-2">
						<div className="flex-1">Period</div>
						<div className="flex-1">
							<Select
								defaultValue={selectedPeriod?.period_name}
								onValueChange={(chosen) => {
									const targetPeriod = getPeriod.data!.find(
										(item) => item.period_name === chosen
									)!;
									setTmpPeriod(targetPeriod);
									// setSelectedPeriod(targetPeriod);
									// SessionStorage.setSelectedPeriod(
									//	targetPeriod
									// );
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a period" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Period</SelectLabel>
										{getPeriod.data!.map((period_info) => {
											return (
												<SelectItem
													key={
														period_info.period_name
													}
													value={
														period_info.period_name
													}
												>
													{period_info.period_name}
												</SelectItem>
											);
										})}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="flex w-full p-2">
						<div className="flex-1">發薪日期</div>
						<div className="flex-1">
							<Input
								type="Date"
								defaultValue={selectedPayDate ?? undefined}
								onChange={(e) => {
									// setSelectedPayDate(e.target.value);
									// SessionStorage.setSelectedPayDate(
									//	e.target.value
									// );
									setTmpPayDate(e.target.value);
								}}
							></Input>
						</div>
					</div>
					<DialogClose>
						<Button
							onClick={() => {
								if (tmpPeriod != null) {
									setSelectedPeriod(tmpPeriod);
									SessionStorage.setSelectedPeriod(tmpPeriod);
								}
								if (tmpPayDate != null) {
									setSelectedPayDate(tmpPayDate);
									SessionStorage.setSelectedPayDate(
										tmpPayDate
									);
								}
							}}
						>
							儲存
						</Button>
					</DialogClose>
				</>
			) : (
				<></>
			)}
		</div>
	);
}
