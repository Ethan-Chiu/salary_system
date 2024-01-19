import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "Bonus Seniority Setting";

const BonusSeniority: NextPageWithLayout = () => {
	const getAllBonusSeniority =
		api.parameters.getAllBonusSeniority.useQuery();
	const updateBonusSeniority =
		api.parameters.updateBonusSeniority.useMutation({
			onSuccess: () => {
				getAllBonusSeniority.refetch();
			},
		});
	const createBonusSeniority =
		api.parameters.createBonusSeniority.useMutation({
			onSuccess: () => {
				getAllBonusSeniority.refetch();
			},
		});
	const deleteBonusSeniority =
		api.parameters.deleteBonusSeniority.useMutation({
			onSuccess: () => {
				getAllBonusSeniority.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_BONUS_SENIORITY}
				queryFunction={getAllBonusSeniority}
				updateFunction={updateBonusSeniority}
				createFunction={createBonusSeniority}
				deleteFunction={deleteBonusSeniority}
			/>
		</div>
	);
};

BonusSeniority.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default BonusSeniority;
