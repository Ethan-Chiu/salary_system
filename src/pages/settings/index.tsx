import { RootLayout } from "~/components/layout/root_layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { type NextPageWithLayout } from "../_app";
import { type ReactElement } from "react";

import { ProfileForm } from "./components/profile";
import { AppearanceForm } from "./components/appearance";
import { Header } from "~/components/header"
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { changePasswordForm } from "./components/changePassword";

const PageSettings: NextPageWithLayout = () => {
	return (
		<>
			<Header title="Settings" showOptions className="mb-4"/>
			<Tabs defaultValue="profile" className="h-full space-y-6">
				<div className="space-between flex items-center">
					<TabsList>
						<TabsTrigger value="profile" className="relative">
							Profile
						</TabsTrigger>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="appearance">Appearance</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent
					value="profile"
					className="border-none p-0 outline-none"
				>
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-2xl font-semibold tracking-tight">
								Profile
							</h2>
							<p className="text-sm text-muted-foreground">
								Edit your profile here
							</p>
						</div>
					</div>
					<Separator className="my-4" />
					<ProfileForm />
				</TabsContent>
				<TabsContent
					value="account"
					// className="h-full flex-col border-none p-0 data-[state=active]:flex"
				>
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-2xl font-semibold tracking-tight">
								Account
							</h2>
							{/* <p className="text-sm text-muted-foreground">
								Edit your account information here
							</p> */}
						</div>
					</div>
					{changePasswordForm("card")}
					<Separator className="my-4" />
				</TabsContent>
				<TabsContent
					value="appearance"
					className="h-full flex-col border-none p-0 data-[state=active]:flex"
				>
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<h2 className="text-2xl font-semibold tracking-tight">
								Appearance
							</h2>
							<p className="text-sm text-muted-foreground">
								Modify you webpage appearance
							</p>
						</div>
					</div>
					<Separator className="my-4" />
					<AppearanceForm />
				</TabsContent>
			</Tabs>
		</>
	);
};

PageSettings.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="functions">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageSettings;
