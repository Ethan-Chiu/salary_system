import { RootLayout } from "~/components/layout/root_layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { type NextPageWithLayout } from "../_app";
import { useContext, type ReactElement } from "react";

import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { UserPreferenceContext, UserPreferenceProvider } from "../settings/components/UserPreference";
import { Button } from "~/components/ui/button";
import { Translate } from "../develop_parameters/utils/translation";


const PageSettings: NextPageWithLayout = () => {
	
	// const id = Translate("id");
	const {language, setLanguage} = useContext(UserPreferenceContext);

	return (
		<>
			{language}
			<Button onClick={() => setLanguage("en")}>
				Change
			</Button>
			{/* {id} */}
		</>
	);
};

PageSettings.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
				<PerpageLayoutNav pageTitle="test">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageSettings;
