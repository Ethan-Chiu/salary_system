import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { SyncPageContent } from "~/components/synchronize/sync_page_content";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";
import { FunctionsEnum } from "~/server/api/types/functions_enum";

interface SyncPageProps {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function SyncPage({ period, selectedIndex, setSelectedIndex }: SyncPageProps) {
	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: FunctionsEnum.enum.month_salary,
			period: period,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? (
		<div className="grow flex flex-col">
			<div className="flex flex-grow flex-col">
				<SyncPageContent data={data} />
			</div>
      <div className="mt-4 flex justify-end">
				<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
					{Translate("next_step")}
				</Button>
			</div>

		</div>
	) : (
		<div>no data</div>
	);
}
