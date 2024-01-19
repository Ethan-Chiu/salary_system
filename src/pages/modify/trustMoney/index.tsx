import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/lib/utils/translation";

const PageTitle = "TrustMoney Setting";

const TrustMoney: NextPageWithLayout = () => {
	const getAllTrustMoney =
		api.parameters.getAllTrustMoney.useQuery();
	const updateTrustMoney =
		api.parameters.updateTrustMoney.useMutation({
			onSuccess: () => {
				getAllTrustMoney.refetch();
			},
		});
	const createTrustMoney =
		api.parameters.createTrustMoney.useMutation({
			onSuccess: () => {
				getAllTrustMoney.refetch();
			},
		});
	const deleteTrustMoney =
		api.parameters.deleteTrustMoney.useMutation({
			onSuccess: () => {
				getAllTrustMoney.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<div className="" />
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_TRUST_MONEY}
				queryFunction={getAllTrustMoney}
				updateFunction={updateTrustMoney}
				createFunction={createTrustMoney}
				deleteFunction={deleteTrustMoney}
			/>
		</div>
	);
};

TrustMoney.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TrustMoney;
