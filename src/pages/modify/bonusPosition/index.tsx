import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "Bonus Position Setting";

const BonusPosition: NextPageWithLayout = () => {
	const getAllBonusPosition =
		api.parameters.getAllBonusPosition.useQuery();
	const updateBonusPosition =
		api.parameters.updateBonusPosition.useMutation({
			onSuccess: () => {
				getAllBonusPosition.refetch();
			},
		});
	const createBonusPosition =
		api.parameters.createBonusPosition.useMutation({
			onSuccess: () => {
				getAllBonusPosition.refetch();
			},
		});
	const deleteBonusPosition =
		api.parameters.deleteBonusPosition.useMutation({
			onSuccess: () => {
				getAllBonusPosition.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_BONUS_POSITION}
				queryFunction={getAllBonusPosition}
				updateFunction={updateBonusPosition}
				createFunction={createBonusPosition}
				deleteFunction={deleteBonusPosition}
			/>
		</div>
	);
};

BonusPosition.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default BonusPosition;
