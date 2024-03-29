import { useContext } from "react";
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

export default function PeriodSelector() {
	const getPeriod = api.function.getPeriod.useQuery();
	const {
		selectedPeriod,
		setSelectedPeriod,
		selectedPayDate,
		setSelectedPayDate,
	} = useContext(periodContext);

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
									setSelectedPeriod(targetPeriod);
									SessionStorage.setSelectedPeriod(
										targetPeriod
									);
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
									setSelectedPayDate(e.target.value);
									SessionStorage.setSelectedPayDate(
										e.target.value
									);
								}}
							></Input>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</div>
	);
}
