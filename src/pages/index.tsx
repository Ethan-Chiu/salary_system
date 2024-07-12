import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "./_app";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import i18n from "~/lib/utils/i18n";


const PageHome: NextPageWithLayout = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const { data, refetch } = api.access.accessByRole.useQuery(undefined, {
		enabled: false,
	});

	i18n.changeLanguage( router.locale || "en");

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (status === "unauthenticated") {
		void Router.push("/login");
	}

	if (status === "authenticated") {
		void refetch();
	}

	if (data && status === "authenticated") {
		if (data?.actions) {
			void Router.replace("/functions");
		} else {
			void Router.replace("/settings");
		}
	}

	return <></>;
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return <RootLayout>{page}</RootLayout>;
};

export default PageHome;
