import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { progressBarLabels } from ".";

export function EmployeePage({
	selectedIndex,
	setSelectedIndex,
}: {
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	return (
		<>
			<div className="grow">
				<p>123</p>
			</div>
			<div className="flex justify-between">
				<Button
					onClick={() => setSelectedIndex(selectedIndex - 1)}
					disabled={selectedIndex === 0}
				>
					{Translate("previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
					disabled={selectedIndex === progressBarLabels.length - 1}
				>
					{Translate("next_step")}
				</Button>
			</div>
		</>
	);
}
