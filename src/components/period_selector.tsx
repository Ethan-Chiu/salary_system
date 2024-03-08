import { useContext } from "react";
import { api } from "~/utils/api";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import periodContext from "./context/period_context";


export default function PeriodSelector() {
	const getPeriod = api.function.getPeriod.useQuery();
	const { selectedPeriod, setSelectedPeriod } = useContext(periodContext);
	
	return (
		<div className="flex justify-center">
			{getPeriod.isFetched ? (
				<div className="py-4">
					<Select
						defaultValue={selectedPeriod?.period_name}
						onValueChange={(chosen) =>
							setSelectedPeriod(
								getPeriod.data!.find(
									(item) => item.period_name === chosen
								)!
							)
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select a period" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Period</SelectLabel>
								{getPeriod.data!.map((period_info) => {
									return (
										<SelectItem
                      key={period_info.period_name}
											value={period_info.period_name}
										>
											{period_info.period_name}
										</SelectItem>
									);
								})}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			) : (
				<></>
			)}
		</div>
	);
}


