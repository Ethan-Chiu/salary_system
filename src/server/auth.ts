import { type GetServerSidePropsContext } from "next";
import {
	getServerSession,
	type NextAuthOptions,
	type DefaultSession,
	DefaultUser,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { container } from "tsyringe";
import { env } from "~/env.mjs";
import { UserService } from "./service/userService";
import * as bcrypt from "bcrypt";
import { BaseResponseError } from "./api/error/BaseResponseError";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
interface JWTUser extends DefaultUser {
	emp_id: string;
}

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: DefaultSession["user"] & {
			id: number;
			emp_id: string;
			// ...other properties
			// role: UserRole;
		};
	}

	interface User extends JWTUser {}
}

// nextauth.d.ts
declare module "next-auth/jwt" {
	interface JWT extends JWTUser {}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/login",
		// signOut: '/auth/signout',
		error: "/login", // Error code passed in query string as ?error=
	},
	jwt: {
		secret: env.NEXTAUTH_JWT_SECRET,
		maxAge: 15 * 24 * 30 * 60, // 15 days
	},
	secret: env.NEXTAUTH_SECRET,
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.emp_id = user.emp_id
			}
			return token;
		},
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.sub,
					emp_id: token.emp_id
				},
			};
		},
	},
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "credentials",
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {
					label: "UserId",
					type: "text",
					placeholder: "abcdefg",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)
				const input = {
					emp_id: credentials?.username ?? "",
					password: credentials?.password ?? "",
				};

				const userService = container.resolve(UserService);
				const user = await userService.getUser(input.emp_id);

				if (!user) {
					throw new BaseResponseError("User does not exist");
				} else {
					const match = await bcrypt.compare(
						input.password,
						user.hash
					);
					if (!match) {
						throw new BaseResponseError("Wrong password");
					} else {
						await userService.updateUser(
							input.emp_id,
							input.password
						);
					}
				}

				return {
					id: user.id,
					emp_id: user.emp_id,
				} as any;
			},
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
	req: GetServerSidePropsContext["req"];
	res: GetServerSidePropsContext["res"];
}) => {
	return getServerSession(ctx.req, ctx.res, authOptions);
};
