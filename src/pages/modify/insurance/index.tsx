import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

const PageTitle = "InsuranceRate Setting";

const InsuranceRate: NextPageWithLayout = () => {
	const getAllInsuranceRateSetting =
		api.parameters.getAllInsuranceRateSetting.useQuery();
	const updateInsuranceRateSetting =
		api.parameters.updateInsuranceRateSetting.useMutation({
			onSuccess: () => {
				getAllInsuranceRateSetting.refetch();
			},
		});
	const createInsuranceRateSetting =
		api.parameters.createInsuranceRateSetting.useMutation({
			onSuccess: () => {
				getAllInsuranceRateSetting.refetch();
			},
		});
	const deleteInsuranceRateSetting =
		api.parameters.deleteInsuranceRateSetting.useMutation({
			onSuccess: () => {
				getAllInsuranceRateSetting.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_INSURANCE}
				queryFunction={getAllInsuranceRateSetting}
				updateFunction={updateInsuranceRateSetting}
				createFunction={createInsuranceRateSetting}
				deleteFunction={deleteInsuranceRateSetting}
			/>
		</div>
	);
};

InsuranceRate.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default InsuranceRate;
