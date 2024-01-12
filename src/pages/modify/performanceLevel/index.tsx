import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "Performance Level Setting";

const PerformanceLevel: NextPageWithLayout = () => {
	const getAllPerformanceLevel =
		api.parameters.getAllPerformanceLevel.useQuery();
	const updatePerformanceLevel =
		api.parameters.updatePerformanceLevel.useMutation({
			onSuccess: () => {
				getAllPerformanceLevel.refetch();
			},
		});
	const createPerformanceLevel =
		api.parameters.createPerformanceLevel.useMutation({
			onSuccess: () => {
				getAllPerformanceLevel.refetch();
			},
		});
	const deletePerformanceLevel =
		api.parameters.deletePerformanceLevel.useMutation({
			onSuccess: () => {
				getAllPerformanceLevel.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_PERFORMANCE_LEVEL}
				queryFunction={getAllPerformanceLevel}
				updateFunction={updatePerformanceLevel}
				createFunction={createPerformanceLevel}
				deleteFunction={deletePerformanceLevel}
			/>
		</div>
	);
};

PerformanceLevel.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PerformanceLevel;
