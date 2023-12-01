import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "./_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Router from "next/router";

const PageHome: NextPageWithLayout = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (status === "unauthenticated") {
		Router.push("/login");
	}

	if (status === "authenticated") {
		console.log(session);
		Router.push("/functions");
	}

	return <></>;
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return <RootLayout>{page}</RootLayout>;
};

export default PageHome;
