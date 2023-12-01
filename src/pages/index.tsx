import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "./_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { IconCoins } from "~/components/icons/svg_icons";
import { Header } from "~/components/header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { RolesEnumType } from "~/server/api/types/role_type";

const PageHome: NextPageWithLayout = () => {
	const { data: session, status } = useSession();

	const { data, refetch  } =
		api.access.accessByRole.useQuery(undefined, {enabled: false});

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (status === "unauthenticated") {
		Router.push("/login");
	}

	if (status === "authenticated") {
		console.log("session", session);
		refetch();
	}

	if (data && status === "authenticated") {
		if (data?.actions) {
			Router.push("/functions");
		} else {
		Router.push("/settings");
		}
	}

	return <></>;
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return <RootLayout>{page}</RootLayout>;
};

export default PageHome;
