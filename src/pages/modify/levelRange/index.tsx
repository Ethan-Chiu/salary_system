import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "Level Range Setting";

const LevelRange: NextPageWithLayout = () => {
	const getAllLevelRange =
		api.parameters.getAllLevelRange.useQuery();
	const updateLevelRange =
		api.parameters.updateLevelRange.useMutation({
			onSuccess: () => {
				getAllLevelRange.refetch();
			},
		});
	const createLevelRange =
		api.parameters.createLevelRange.useMutation({
			onSuccess: () => {
				getAllLevelRange.refetch();
			},
		});
	const deleteLevelRange =
		api.parameters.deleteLevelRange.useMutation({
			onSuccess: () => {
				getAllLevelRange.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_LEVEL_RANGE}
				queryFunction={getAllLevelRange}
				updateFunction={updateLevelRange}
				createFunction={createLevelRange}
				deleteFunction={deleteLevelRange}
			/>
		</div>
	);
};

LevelRange.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default LevelRange;
