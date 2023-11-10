import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
	function middleware(request: NextRequestWithAuth) {
		console.log("request token", request.nextauth.token);
		// if (request.nextUrl.pathname.startsWith("/parameters")) {
		// 	return NextResponse.rewrite(
		// 		new URL("/", request.url)
		// 	);
		// }
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
