import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { Sidebar } from "~/components/sidebar";
import { api } from "~/utils/api";
import { UserAvatar } from "~/components/user_avatar";
import { CardFunction } from "~/components/functions/card_function";

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
								<UserAvatar />
							</div>
						</div>
						<div className="h-full px-4 py-6 lg:px-8">
							Main page: Functions
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								<CardFunction title="計算月薪" iconPath="./icons/coins.svg" subscript="some notes"/>
								<CardFunction title="計算年薪" iconPath="./icons/coins.svg" subscript="some notes"/>
								<CardFunction title="計算分紅" iconPath="./icons/coins.svg" subscript="some notes"/>
								<CardFunction title="計算津貼" iconPath="./icons/coins.svg" subscript="some notes"/>
							</div>
						</div>
					</div>
				</div>
			</main>
		</PageLayout>
	);
}
