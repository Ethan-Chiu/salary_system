import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { SyncPageContent } from "~/components/synchronize/sync_page_content";
import { Button } from "~/components/ui/button";
import { FunctionsEnum } from "~/server/api/types/functions_enum";

import { useTranslation } from 'next-i18next'

interface SyncPageProps {
	period: number;
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
}

export function SyncPage({
	period,
	selectedIndex,
	setSelectedIndex,
}: SyncPageProps) {
	const { t } = useTranslation(['common'])

	const { isLoading, isError, data, error } =
		api.sync.checkEmployeeData.useQuery({
			func: FunctionsEnum.Enum.month_salary,
			period: period,
		});

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError) {
		return <span>Error: {error.message}</span>; // TODO: Error element with toast
	}

	return data != null ? (
		<div className="flex grow flex-col">
			<div className="flex flex-grow flex-col">
				<SyncPageContent data={data} />
			</div>
			{data.length == 0 && (
				<div className="mt-4 flex justify-end">
					<Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
						{t("button.next_step")}
					</Button>
				</div>
			)}
		</div>
	) : (
		<div>{t("table.no_data")}</div>
	);
}
