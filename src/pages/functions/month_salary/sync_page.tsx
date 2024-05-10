import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { SyncPageContent } from "~/components/synchronize/sync_page_content";

interface SyncPageProps {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function SyncPage({ period }: SyncPageProps) {
	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: "month_salary",
			period: period,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? (
		<div className="grow">
			<div className="flex h-full flex-grow flex-col">
				<SyncPageContent data={data} />
			</div>
		</div>
	) : (
		<div>no data</div>
	);
}
