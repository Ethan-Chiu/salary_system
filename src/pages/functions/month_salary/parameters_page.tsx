import React from "react";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import TablesView from "~/pages/parameters/tables_view";

export function ParameterPage({
	period,
	selectedIndex,
	setSelectedIndex,
}: {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}) {
	return (
		<>
			<div className="flex h-0 grow flex-col rounded-md border-2">
				<TablesView />
			</div>
			<div className="mt-4 flex justify-between">
				<Button
					onClick={() => setSelectedIndex(selectedIndex - 1)}
				>
					{Translate("previous_step")}
				</Button>
				<Button
					onClick={() => setSelectedIndex(selectedIndex + 1)}
				>
					{Translate("next_step")}
				</Button>
			</div>
		</>
	);
}
