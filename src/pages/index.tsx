import Head from "next/head";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { ProfileForm } from "~/components/profile";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { UserAvatar } from "~/components/user_avatar";

export default function Home() {
	// const hello = api.example.hello.useQuery({ text: "from tRPC" });

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
						<div className="flex h-14 px-4">
							<div className="ml-auto flex items-center space-x-4">
								<UserAvatar/>
							</div>
						</div>
						<div className="h-full px-4 py-6 lg:px-8">
							Main page: Functions
						</div>
					</div>
				</div>
			</main>
		</PageLayout>
	);
}
