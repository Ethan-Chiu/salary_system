import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

const PageTitle = "Bonus Position Type Setting";

const BonusPositionType: NextPageWithLayout = () => {
	const getAllBonusPositionType =
		api.parameters.getAllBonusPositionType.useQuery();
	const updateBonusPositionType =
		api.parameters.updateBonusPositionType.useMutation({
			onSuccess: () => {
				getAllBonusPositionType.refetch();
			},
		});
	const createBonusPositionType =
		api.parameters.createBonusPositionType.useMutation({
			onSuccess: () => {
				getAllBonusPositionType.refetch();
			},
		});
	const deleteBonusPositionType =
		api.parameters.deleteBonusPositionType.useMutation({
			onSuccess: () => {
				getAllBonusPositionType.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_BONUS_POSITION_TYPE}
				queryFunction={getAllBonusPositionType}
				updateFunction={updateBonusPositionType}
				createFunction={createBonusPositionType}
				deleteFunction={deleteBonusPositionType}
			/>
		</div>
	);
};

BonusPositionType.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default BonusPositionType;
