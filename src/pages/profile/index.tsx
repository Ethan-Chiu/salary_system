import { RootLayout } from "~/components/layout/root_layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Translate } from "~/lib/utils/translation";

const ProfilePage: NextPageWithLayout = () => {
	return (
		<>
			<Header title={Translate("profile")} showOptions />
		</>
	);
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="profile">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default ProfilePage;
