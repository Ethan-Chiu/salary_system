import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

const PageTitle = "Level Setting";

const Level: NextPageWithLayout = () => {
	const getAllLevel =
		api.parameters.getAllLevel.useQuery();
	const updateLevel =
		api.parameters.updateLevel.useMutation({
			onSuccess: () => {
				getAllLevel.refetch();
			},
		});
	const createLevel =
		api.parameters.createLevel.useMutation({
			onSuccess: () => {
				getAllLevel.refetch();
			},
		});
	const deleteLevel =
		api.parameters.deleteLevel.useMutation({
			onSuccess: () => {
				getAllLevel.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_LEVEL}
				queryFunction={getAllLevel}
				updateFunction={updateLevel}
				createFunction={createLevel}
				deleteFunction={deleteLevel}
			/>
		</div>
	);
};

Level.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Level;
