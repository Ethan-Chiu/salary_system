import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { api } from "~/utils/api";
import * as TABLE_NAMES from "../../table_names";
import { useRouter } from "next/router";
import Template from "../template";
import { Button } from "~/components/ui/button";
import { Translate } from "~/pages/develop_parameters/utils/translation";

const PageTitle = "Bank Setting";

const Bank: NextPageWithLayout = () => {
	const getAllBankSetting =
		api.parameters.getAllBankSetting.useQuery();
	const updateBankSetting =
		api.parameters.updateBankSetting.useMutation({
			onSuccess: () => {
				getAllBankSetting.refetch();
			},
		});
	const deleteBankSetting =
		api.parameters.deleteBankSetting.useMutation({
			onSuccess: () => {
				getAllBankSetting.refetch();
			},
		});

	return (
		<div className="flex min-h-full flex-col">
			<Template
				headerTitle={PageTitle}
				table_name={TABLE_NAMES.TABLE_BANK_SETTING}
				queryFunction={getAllBankSetting}
				updateFunction={updateBankSetting}
				deleteFunction={deleteBankSetting}
			/>
		</div>
	);
};

Bank.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle={PageTitle}>{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default Bank;
