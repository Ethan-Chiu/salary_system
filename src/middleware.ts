import { NextResponse } from "next/server";
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import {
	type AccessiblePagesType,
	accessiblePages,
} from "./server/api/types/access_page_type";
import { BaseResponseError } from "./server/api/error/BaseResponseError";
import { z } from "zod";

function guardRoute(
	request: NextRequestWithAuth,
	route: string,
	access: boolean
): NextResponse | null {
	if (request.nextUrl.pathname.startsWith(route)) {
		if (access) {
			return NextResponse.rewrite(
				new URL(request.nextUrl.pathname, request.url)
			);
		}
		console.log(`You cannot view ${route} page`);
		return NextResponse.redirect(new URL("/", request.url));
	}
	return null;
}

export default withAuth(
	async function middleware(request: NextRequestWithAuth) {
		/* const token = request.nextauth.token; */
		// console.log("request token", token);

		const res = await fetch(
			process.env.NEXTAUTH_URL + "/api/trpc/access.accessByRole",
			{ method: "GET", headers: request.headers }
		);

		/* const ResponseSchema = z.object({ */
		/*   result: z.object({ */
		/*     data: z.object({ */
		/*       json: z */
		/*         .object(AccessiblePagesType) // Use your imported type directly */
		/*         .nullable(), // Make json property nullable */
		/*       }), */
		/*     }), */
		/* }); */

		const data: { result: { data: { json: AccessiblePagesType } } } =
			await res.json();
		// console.log("Data", data)

		const parseAccessible = accessiblePages.safeParse(
			data.result.data.json
		);
		if (!parseAccessible.success) {
			console.log(parseAccessible.error);
			throw new BaseResponseError(`Internal Error: No accessible page`);
		}
		const accessible = parseAccessible.data;

		const guarded =
			guardRoute(request, "/functions", accessible.actions) ??
			guardRoute(request, "/parameters", accessible.actions) ??
			guardRoute(request, "/roles", accessible.roles) ??
			guardRoute(request, "/settings", accessible.settings);
		if (guarded !== null) {
			return guarded;
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => {
				return !!token;
			},
		},
		// need to match the pages in auth.ts
		pages: {
			signIn: "/login",
			// signOut: '/auth/signout',
			error: "/login", // Error code passed in query string as ?error=
		},
	}
);

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
