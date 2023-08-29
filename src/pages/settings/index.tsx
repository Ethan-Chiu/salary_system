import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { ProfileForm } from "~/components/profile";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator"

export default function Home() {

	return (
		<PageLayout>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content="Salary system" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen bg-background">
				<div className="grid min-h-screen lg:grid-cols-5">
					<Sidebar className="hidden lg:block lg:border-border" />
					<div className="col-span-3 lg:col-span-4 lg:border-l">
						<div className="h-full px-4 py-6 lg:px-8">
							<Tabs
								defaultValue="profile"
								className="h-full space-y-6"
							>
								<div className="space-between flex items-center">
									<TabsList>
										<TabsTrigger
											value="profile"
											className="relative"
										>
											Profile
										</TabsTrigger>
										<TabsTrigger value="account">
											Account
										</TabsTrigger>
										<TabsTrigger value="appearance">
											Appearance
										</TabsTrigger>
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
									className="h-full flex-col border-none p-0 data-[state=active]:flex"
								>
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<h2 className="text-2xl font-semibold tracking-tight">
												Account
											</h2>
											<p className="text-sm text-muted-foreground">
												Edit your account information here
											</p>
										</div>
									</div>
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
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</div>
			</main>
		</PageLayout>
	);
}
