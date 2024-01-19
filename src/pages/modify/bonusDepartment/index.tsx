import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "Bonus Department Setting";

const BonusDepartment: NextPageWithLayout = () => {
	const getAllBonusDepartment =
		api.parameters.getAllBonusDepartment.useQuery();
	const updateBonusDepartment =
		api.parameters.updateBonusDepartment.useMutation({
			onSuccess: () => {
				getAllBonusDepartment.refetch();
			},
		});
	const createBonusDepartment =
		api.parameters.createBonusDepartment.useMutation({
			onSuccess: () => {
				getAllBonusDepartment.refetch();
			},
		});
	const deleteBonusDepartment =
		api.parameters.deleteBonusDepartment.useMutation({
			onSuccess: () => {
				getAllBonusDepartment.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_BONUS_DEPARTMENT}
				queryFunction={getAllBonusDepartment}
				updateFunction={updateBonusDepartment}
				createFunction={createBonusDepartment}
				deleteFunction={deleteBonusDepartment}
			/>
		</div>
	);
};

BonusDepartment.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default BonusDepartment;
