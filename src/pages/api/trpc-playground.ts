import { type NextApiHandler } from "next";
import { nextHandler } from "trpc-playground/handlers/next";
import { appRouter } from "~/server/api/root";
import { zodResolveTypes } from './trpc-playground-fix' // 👈 Import zodResolveTypes from gist file

const setupHandler = nextHandler({
	router: appRouter,
	// tRPC api path, pages/api/trpc/[trpc].ts in this case
	trpcApiEndpoint: "/api/trpc",
	playgroundEndpoint: "/api/trpc-playground",
	// uncomment this if you're using superjson
  resolveTypes: zodResolveTypes, // 👈 Pass in the updated zodResolveTypes function with the fixes to resolveTypes option
	request: {
		superjson: true,
	},
});

const handler: NextApiHandler = async (req, res) => {
	const playgroundHandler = await setupHandler;
	await playgroundHandler(req, res);
};

export default handler;
